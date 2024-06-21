import { routeKeyRetriever } from '@/auth/accessKey';
import { diffBodyParser } from '@/lib/spotify/validators';
import { sanitize } from 'isomorphic-dompurify';
import { handlerWithTimeoutAndAuth } from '@/lib/misc/wrappers';
import {
	getPlaylistTracks,
	createEmptyPlaylist,
	populatePlaylistWithComparison,
} from './_lib/requests';
import { concurrentThrowNotReturn, myRace } from './_lib/common';
import { badResponse } from '@/lib/route_helpers';

import { SERVER_DIFF_TYPES, SPOT_LOGIN_WINDOW } from '@/consts/spotify';

import { NextAuthRequest } from 'next-auth/lib';
import {
	MyPlaylistObject,
	differInternalPlaylistPromise,
} from '@/components/spotify/types';

const RATE_LIMIT_PREFIX = 'CDP';
const RATE_LIMIT_ROLLING_LIMIT = 5;
const RATE_LIMIT_DECAY_SECONDS = 30;

export const maxDuration = 55;

const handler = async (req: NextAuthRequest) => {
	if (!req.auth || !req.auth.user || !req.auth.user.id) return badResponse(401);

	const globalTimeoutMS = Date.now() + (maxDuration - 1) * 1000;
	// Because of timeouts, allow partial flag and reasons
	let part = [] as string[];

	// Validate body and body values
	let target, differ, actionType, newName, newDesc, keepImg;
	try {
		const parsed = diffBodyParser.parse(await req.json());
		target = parsed.target;
		differ = parsed.differ;
		actionType = parsed.type;
		newName = parsed.newName;
		newDesc = parsed.newDesc;
		keepImg = parsed.keepImg;
	} catch {
		return badResponse(400);
	}

	// Access token should never expire if there is a session
	// Custom access token retriever outside of next-auth flow
	// Network failure is possible here
	let token;
	try {
		token = await routeKeyRetriever(req.auth.user.id);
	} catch {
		return badResponse(502, { message: 'Server error; try again' });
	}
	// No token means that user account somehow unlinked => client redirect
	if (token === null) return badResponse(401);
	// Check if session is being accessed when access token might not be live
	const { expiresAt, accessToken } = token;
	if (
		expiresAt === null ||
		accessToken === null ||
		Date.now() - expiresAt < 3600 - SPOT_LOGIN_WINDOW
	)
		return badResponse(401);

	newName = newName ? sanitize(newName) : null;

	let targetResponse, differResponse, emptyPlaylistResponse;
	try {
		[targetResponse, differResponse, emptyPlaylistResponse] = await Promise.all(
			[
				concurrentThrowNotReturn(
					myRace(
						getPlaylistTracks({
							accessToken,
							type: target.type,
							id: target.id,
						}),
						30 * 1000
					)
				),
				concurrentThrowNotReturn(
					myRace(
						getPlaylistTracks({
							accessToken,
							type: differ.type,
							id: differ.id,
						}),
						30 * 1000
					)
				),
				concurrentThrowNotReturn(
					myRace(
						createEmptyPlaylist({
							accessToken,
							newName,
							target: keepImg && target,
						}),
						30 * 1000
					)
				),
			]
		);
	} catch (e: any) {
		const thing = e as Response;
		if (!thing.ok === false || thing.status > 399) return thing as Response;
		return badResponse(502, { message: 'Unknown error reaching Spotify' });
	}

	const targetDetails =
		(await targetResponse.json()) as differInternalPlaylistPromise;
	const differDetails =
		(await differResponse.json()) as differInternalPlaylistPromise;

	if (targetDetails.completed !== targetDetails.total) {
		const { completed, total } = targetDetails;
		part.push(`Found ${completed}/${total} tracks for the target.`);
	}
	if (differDetails.completed !== differDetails.total) {
		const { completed, total } = differDetails;
		part.push(`Found ${completed}/${total} tracks for the differ.`);
	}
	const newPlaylist = (await emptyPlaylistResponse.json()) as MyPlaylistObject;

	let result: Set<string> = new Set();
	let tSet: Set<string> = new Set();
	let dSet: Set<string> = new Set();
	let tu: number | undefined = undefined;
	let shared: number | undefined = undefined;
	let du: number | undefined = undefined;
	switch (actionType) {
		case 'adu': // Add differ uniques to target
			du = differDetails.items.length;
			result = new Set(targetDetails.items);
			for (const uri of differDetails.items) {
				if (result.has(uri)) du--;
				else result.add(uri);
			}
			part.push(`${du} tracks from the differ added to the target.`);

		case 'odu': // Only differ uniques
			tSet = new Set(targetDetails.items);
			du = 0;
			for (const uri of differDetails.items)
				if (!tSet.has(uri)) {
					result.add(uri);
					du++;
				}
			part.push(`Target replaced by ${du} unique tracks from the differ.`);

		case 'otu': // Only target uniques
			shared = 0;
			dSet = new Set(differDetails.items);
			for (const uri of targetDetails.items) {
				if (dSet.has(uri)) {
					shared++;
					continue;
				}
				result.add(uri);
			}

		case 'bu': // Only uniquse from both
			tu = 0;
			du = 0;
			dSet = new Set(differDetails.items);
			tSet = new Set(targetDetails.items);
			for (const uri of tSet) {
				if (!dSet.has(uri)) {
					result.add(uri);
					tu++;
					continue;
				}
				tSet.delete(uri);
				dSet.delete(uri);
			}
			for (const uri of dSet) {
				result.add(uri);
				du++;
			}
			part.push(
				`${du} tracks from the differ were added; ` +
					`${targetDetails.items.length - tu} tracks were removed.`
			);
		case 'stu': // Subtract target uniques
			shared = 0;
			dSet = new Set(differDetails.items);
			for (const uri of targetDetails.items)
				if (dSet.has(uri)) {
					result.add(uri);
					shared++;
				}
			part.push(`The target now only contains ${shared} shared tracks.`);
	}

	const description = newDesc
		? sanitize(newDesc)
		: SERVER_DIFF_TYPES({
				actionType,
				target: {
					name: target.name,
					owner: target.owner.reduce((str, current, index) => {
						let newstr =
							str +
							`${current.name}${index < target.owner.length - 1 ? ', ' : ''}`;
						return newstr;
					}, ''),
				},
				differ: {
					name: differ.name,
					owner: differ.owner.reduce((str, current, index) => {
						let newstr =
							str +
							`${current.name}${index < differ.owner.length - 1 ? ', ' : ''}`;
						return newstr;
					}, ''),
				},
		  })({ tu, shared, du });

	const addToPlaylistResponse = await populatePlaylistWithComparison({
		accessToken,
		id: newPlaylist.id,
		items: result,
		globalTimeoutMS,
		description,
	});

	if (!addToPlaylistResponse.ok) return addToPlaylistResponse;
	const { total, completed } = (await addToPlaylistResponse.json()) as {
		total: number;
		completed: number;
	};
	newPlaylist.tracks = total;
	if (completed !== total)
		part.push(
			`${completed}/${total} tracks from the comparison successively added to playlist`
		);

	return Response.json({ part, playlist: newPlaylist }, { status: 201 });
};

export const POST = handlerWithTimeoutAndAuth(
	{
		maxDuration,
		rateLimit: {
			RATE_LIMIT_DECAY_SECONDS,
			RATE_LIMIT_PREFIX,
			RATE_LIMIT_ROLLING_LIMIT,
		},
	},
	handler
);
