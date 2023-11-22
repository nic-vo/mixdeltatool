import { routeKeyRetriever } from '@lib/auth/accessKey';
import { getServerSession } from 'next-auth';
import { createEmptyPlaylist, outputAdder, playlistGetter, userGetter } from '@lib/spotify/differPromises';
import { diffBodyParser } from '@lib/spotify/validators';

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
	FetchError,
	MalformedError,
	ReqMethodError,
	UnprocessableError
} from '@lib/spotify/errors';

export default async function handler(
	req: createDiffPlaylistApiRequest, res: NextApiResponse
) {
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
	let part = { reasons: [] as string[] };
	try {
		// Validate req method
		if (req.method !== 'POST') throw new ReqMethodError('POST');
		// Validate body and body values
		let target, differ, actionType;
		try {
			const parsed = diffBodyParser.parse(req.body);
			target = parsed.target;
			differ = parsed.differ;
			actionType = parsed.type;
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

		// Get user and create playlist
		const userId = await userGetter({ accessToken, globalTimeoutMS });
		newPlaylist = await createEmptyPlaylist({
			accessToken,
			actionType,
			userId,
			target,
			differ,
			globalTimeoutMS
		});

		let targetDetails, differDetails;
		// Each one has 5 second timeout
		const results = await Promise.all([
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
			})
		]);
		if (results[0].apiNull === true)
			part = {
				reasons: [
					...part.reasons,
					'The Spotify API returned empty info for some tracks for the target'
				]
			};
		if (results[1].apiNull === true)
			part = {
				reasons: [
					...part.reasons,
					'The Spotify API returned empty info for some tracks for the differ'
				]
			};
		if (results[0].partial === true)
			part = { reasons: [...part.reasons, 'target get was incomplete'] };
		if (results[1].partial === true)
			part = { reasons: [...part.reasons, 'differ get was incomplete'] };
		targetDetails = results[0];
		differDetails = results[1];

		// Five sets: two originals, one for similarities, both uniques
		const targetOriginal = new Set(targetDetails.items);
		const differOriginal = new Set(differDetails.items);

		// Determine which diff needs to happen
		// New set based on diff type from the other maps
		let diffResult: Set<string>;
		switch (actionType) {
			case 'adu':
				// Add differ uniques to target
				diffResult = new Set(targetDetails.items.concat(differDetails.items));
				break;
			case 'odu':
				// Only differ uniques
				diffResult = new Set();
				for (const uri of differOriginal)
					if (targetOriginal.has(uri) === false)
						diffResult.add(uri);
				break;
			case 'otu':
				// Only target uniques
				diffResult = new Set();
				for (const uri of targetOriginal)
					if (differOriginal.has(uri) === false)
						diffResult.add(uri);
				break;
			case 'bu':
				// Both uniques
				diffResult = new Set();
				for (const uri of targetOriginal)
					if (differOriginal.has(uri) === false) diffResult.add(uri);
				for (const uri of differOriginal)
					if (targetOriginal.has(uri) === false) diffResult.add(uri);
				break;
			case 'stu':
				// Subtract target uniques
				diffResult = new Set();
				for (const uri of targetOriginal)
					if (differOriginal.has(uri)) diffResult.add(uri);
				break;
		};

		const newPlaylistAddResult = await outputAdder({
			accessToken,
			id: newPlaylist.id,
			items: diffResult,
			globalTimeoutMS
		});
		if (newPlaylistAddResult.partial === true)
			part = {
				reasons: [
					...part.reasons,
					'New playlist only has a partial result of the diffing operation'
				]
			};
		newPlaylist.tracks = newPlaylistAddResult.total;

		clearTimeout(globalTimeout);
		return res.status(201).json({ part, playlist: newPlaylist });
	} catch (e: any) {
		clearTimeout(authTimeout);
		clearTimeout(globalTimeout);
		return res.status(e.status ? e.status : 500)
			.json({ message: e.message ? e.message : 'Unknown error' });
	};
};
