import { routeKeyRetriever } from '@lib/auth/accessKey';
import { getServerSession } from 'next-auth';
import {
	createEmptyPlaylist,
	outputAdder,
	playlistGetter,
	updateDescription,
} from '@lib/spotify/differPromises';
import { diffBodyParser } from '@lib/spotify/validators';
import { printTime } from '@lib/misc';
import { checkAndUpdateEntry } from '@lib/database/redis/ratelimiting';
import { sanitize } from 'dompurify';

import {
	AUTH_WINDOW,
	GLOBAL_EXECUTION_WINDOW,
	SERVER_DIFF_TYPES,
	SPOT_LOGIN_WINDOW
} from '@consts/spotify';
import { authOptions } from '@lib/auth/options';

import { NextApiResponse } from 'next';
import { ZodError } from 'zod/lib';
import {
	MyPlaylistObject,
	createDiffPlaylistApiRequest,
} from '@components/spotify/types';
import {
	AuthError,
	CustomError,
	FetchError,
	MalformedError,
	RateError,
	ReqMethodError,
	UnprocessableError
} from '@lib/errors';

const RATE_LIMIT_PREFIX = 'CDP';
const RATE_LIMIT_ROLLING_LIMIT = 5;
const RATE_LIMIT_DECAY_SECONDS = 30;

export default async function handler(
	req: createDiffPlaylistApiRequest, res: NextApiResponse
) {
	const start = Date.now();
	let nextStep;

	// return res.status(400).json({message: 'Testing diff message'});
	const globalTimeoutMS = Date.now() + GLOBAL_EXECUTION_WINDOW;
	const authTimeout = setTimeout(() => {
		return res.status(504).json({ message: 'Server timed out' })
	}, AUTH_WINDOW);
	const globalTimeout = setTimeout(() => {
		if (newPlaylist !== undefined)
			return res.status(200).json({ part, playlist: newPlaylist });
		return res.status(504).json({ message: 'Server timed out' })
	}, GLOBAL_EXECUTION_WINDOW);

	let newPlaylist: MyPlaylistObject;
	// Because of imeouts, allow partial flag and reasons
	let part = [] as string[];
	try {
		// Validate req method
		if (req.method !== 'POST') throw new ReqMethodError('POST');

		const forHeader = req.headers['x-forwarded-for'];
		if (!forHeader)
			throw new CustomError(500, 'Internal Error');
		const ip = Array.isArray(forHeader) ? forHeader[0] : forHeader;
		const rateLimit = await checkAndUpdateEntry({
			ip,
			prefix: RATE_LIMIT_PREFIX,
			rollingLimit: RATE_LIMIT_ROLLING_LIMIT,
			rollingDecaySeconds: RATE_LIMIT_DECAY_SECONDS
		});

		if (rateLimit !== null)
			throw new RateError(rateLimit);

		nextStep = printTime('Rate limit passed:', start);
		// Validate body and body values
		let target, differ, actionType, newName, newDesc;
		try {
			const parsed = diffBodyParser.parse(req.body);
			target = parsed.target;
			differ = parsed.differ;
			actionType = parsed.type;
			newName = parsed.newName;
			newDesc = parsed.newDesc;
		} catch (e: any) {
			const error = e as ZodError;
			const map = new Map();
			for (const issue of error.issues) map.set(issue.code, issue);
			if (map.has('unrecognized_keys') === true) throw new MalformedError();
			else throw new UnprocessableError();
		}

		// Undefined check for TypeScript -_-
		if (target === undefined
			|| differ === undefined
			|| actionType === undefined)
			throw new MalformedError();

		let session;
		// Check next-auth session
		try {
			session = await getServerSession(req, res, authOptions);
		} catch {
			throw new FetchError('Server error; try again');
		}
		// If no session, send 401 and client-side should redirect
		if (session === null || session === undefined) throw new AuthError();

		// Access token should never expire if there is a session
		// Custom access token retriever outside of next-auth flow
		// Network failure is possible here
		let token;
		try {
			token = await routeKeyRetriever(session.user.id);
		} catch {
			throw new FetchError('Server error; try again');
		}
		// No token means that user account somehow unlinked => client redirect
		if (token === null || token === undefined) throw new AuthError();
		clearTimeout(authTimeout);

		// Check if session is being accessed when access token might not be live
		const { expiresAt, accessToken } = token;
		if ((expiresAt === undefined || expiresAt === null)
			|| (accessToken === undefined || accessToken === null)
			|| (Date.now() - expiresAt) < (3600 - SPOT_LOGIN_WINDOW))
			throw new AuthError();

		nextStep = printTime('Auth finished:', nextStep);

		const targetTemp = target.owner.length;
		const differTemp = differ.owner.length;

		const baseDescStr = newDesc !== null ?
			sanitize(newDesc) : SERVER_DIFF_TYPES({
				actionType, target:
				{
					name: target.name,
					owner: target.owner.reduce((str, current, index) => {
						let newstr = str + `${current.name}${index < targetTemp - 1 ? ', ' : ''}`;
						return newstr;
					}, '')
				}, differ: {
					name: differ.name,
					owner: differ.owner.reduce((str, current, index) => {
						let newstr = str + `${current.name}${index < differTemp - 1 ? ', ' : ''}`;
						return newstr;
					}, '')
				}
			});

		newName = newName === null ? null : sanitize(newName);

		// Each one has 5 second timeout
		const [targetDetails, differDetails, emptyPlaylist] = await Promise.all([
			playlistGetter({
				accessToken,
				type: target.type,
				id: target.id,
				globalTimeoutMS
			}),
			playlistGetter({
				accessToken,
				type: differ.type,
				id: differ.id,
				globalTimeoutMS
			}),
			createEmptyPlaylist({
				accessToken,
				baseDescStr,
				globalTimeoutMS,
				newName
			})
		]);
		if (targetDetails.completed !== targetDetails.total) {
			const { completed, total } = targetDetails;
			part.push(`Spotify returned only ${completed}/${total} tracks for the target.`);
		}
		if (differDetails.completed !== differDetails.total) {
			const { completed, total } = differDetails;
			part.push(`Spotify returned only ${completed}/${total} tracks for the differ.`);
		}
		newPlaylist = emptyPlaylist;

		nextStep = printTime('Playlists fetched and empty created:', nextStep);

		let result: Set<string> = new Set();
		let tu: number;
		let shared: number;
		let du: number;
		switch (actionType) {
			case 'adu':
				// Add differ uniques to target
				du = differDetails.items.size;
				result = targetDetails.items;
				for (const uri of differDetails.items) {
					if (result.has(uri)) du--;
					result.add(uri);
				}
				part.push(`${du} tracks from the differ were added to the target.`);
				break;
			case 'odu':
				// Only differ uniques
				du = 0;
				for (const uri of differDetails.items)
					if (targetDetails.items.has(uri) === false) {
						result.add(uri);
						du++
					}
				part.push(`The target was replaced by ${du} unique tracks from the differ.`);
				break;
			case 'otu':
				// Only target uniques
				tu = 0;
				for (const uri of targetDetails.items)
					if (differDetails.items.has(uri) === false) {
						result.add(uri);
						tu++
					}
				part.push(
					`${targetDetails.items.size - tu} shared tracks were removed from the target;`
					+ ` ${tu} tracks remain.`);
				break;
			case 'bu':
				shared = 0;
				for (const uri of targetDetails.items) {
					if (differDetails.items.has(uri)) {
						targetDetails.items.delete(uri);
						differDetails.items.delete(uri);
						shared++;
					} else {
						result.add(uri);
					}
				}
				for (const uri of differDetails.items)
					result.add(uri)
				part.push(
					`The target had ${targetDetails.items.size} unique tracks. `
					+ `The differ had ${differDetails.items.size} unique tracks. `
					+ `${shared} shared tracks were removed.`
				)
				break;
			case 'stu':
				// Subtract target uniques
				for (const uri of targetDetails.items)
					if (differDetails.items.has(uri)) {
						targetDetails.items.delete(uri);
						differDetails.items.delete(uri);
						result.add(uri);
					}
				part.push(
					`The target had ${targetDetails.items.size} unique tracks. `
					+ `The differ had ${differDetails.items.size} unique tracks. `
					+ `The target now contains ${result.size} shared tracks.`
				)
				break;
		};

		nextStep = printTime('Diff operation complete:', nextStep);

		const addedToPlaylist = await outputAdder({
			accessToken,
			id: newPlaylist.id,
			items: result,
			globalTimeoutMS
		});
		if (addedToPlaylist.completed % addedToPlaylist.total !== 0) {
			const { completed, total } = addedToPlaylist;
			part.push(`New playlist has ${completed}/${total} tracks from the comparison.`);
		}

		nextStep = printTime(
			`${addedToPlaylist.completed}/${addedToPlaylist.total} tracks added: `,
			nextStep);

		newPlaylist.tracks = addedToPlaylist.total;
		const updatedDescription = await updateDescription({
			accessToken,
			globalTimeoutMS,
			baseDescStr,
			id: newPlaylist.id,
			reasons: part
		})
		if (updatedDescription !== null) part.push(updatedDescription);
		clearTimeout(globalTimeout);
		printTime('Completed:', start);
		return res.status(201).json({ part, playlist: newPlaylist });
	} catch (e: any) {
		clearTimeout(authTimeout);
		clearTimeout(globalTimeout);
		if (e.status === 429) res.setHeader('Retry-After', e.retryTime);
		return res.status(e.status ? e.status : 500)
			.json({ message: e.message ? e.message : 'Unknown error' });
	};
};
