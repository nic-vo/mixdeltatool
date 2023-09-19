import { SPOT_LOGIN_WINDOW, SPOT_URL_BASE } from '@consts/spotify';
import { routeKeyRetriever } from '@lib/auth/accessKey';
import { authOptions } from '@lib/auth/options';
import { getServerSession } from 'next-auth';

import { diffBodyParser } from '@lib/spotify/validators';

import { ZodError } from 'zod/lib';
import { NextApiResponse } from 'next';
import {
	MyPlaylistObject,
	createDiffPlaylistApiRequest,
} from '@components/spotify/types';
import { outputAdder, playlistGetter } from '@lib/spotify/differPromises';

export default async function handler(
	req: createDiffPlaylistApiRequest, res: NextApiResponse
) {
	try {
		// Validate req method
		if (req.method !== 'POST') throw { status: 405, error: 'POST only' };
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
			if (map.has('unrecognized_keys') === true)
				throw { status: 400, error: 'Bad request' };
			else throw { status: 422, error: 'Bad request' };
		};

		// Check next-auth session
		const session = await getServerSession(req, res, authOptions);
		// If no session, send 401 and client-side should redirect
		if (session === null || session === undefined)
			throw { status: 401, error: 'Unauthorized' };

		// Access token should never expire if there is a session
		let token = null;
		// Custom access token retriever outside of next-auth flow
		// Network failure is possible here
		try { token = await routeKeyRetriever(session.user.id) }
		catch { throw { status: 502, error: 'Network error' } };
		// No token means that user account somehow unlinked => client redirect
		if (token === null) throw { status: 401, error: 'Unauthorized' };

		// Check if session is being accessed when access token might not be live
		const { expires_at, access_token } = token;
		if ((expires_at === undefined || expires_at === null)
			|| (access_token === undefined || access_token === null)
			|| Date.now() - expires_at < 3600 - SPOT_LOGIN_WINDOW)
			throw { status: 401, error: 'Unauthorized' };

		// At this point because of timeouts, allow partial success flag and details
		let success = { type: 'full', reasons: [] as string[] };

		// Get user and create playlist
		let newPlaylist: MyPlaylistObject;
		try {
			const headers = new Headers();
			headers.append('Authorization', `Bearer ${access_token}`);

			const userRaw = await fetch(SPOT_URL_BASE.concat('me'), { headers });
			if (userRaw.ok === false)
				switch (userRaw.status) {
					case 401:
					case 403:
						throw { status: 401, error: 'Unauthorized' };
					case 429:
						throw { status: 429, error: 'Try again in a few minutes' };
					default:
						throw { status: 500, error: 'Spotify error' };
				};
			const userJsoned = await userRaw.json();
			headers.append('Content-Type', 'application/json')
			const createPlaylistRaw = await fetch(
				SPOT_URL_BASE.concat('users/', userJsoned.id, '/playlists'),
				{
					headers,
					method: 'POST',
					body: JSON.stringify({
						name: `SuperUser ${actionType} ${Date.now()}`,
						description: 'Created by the Spotify SuperUser playlist tool'
					})
				});
			if (createPlaylistRaw.ok === false)
				switch (createPlaylistRaw.status) {
					case 401:
					case 403:
						throw { status: 401, error: 'Unauthorized' };
					case 429:
						throw { status: 429, error: 'Try again in a few minutes' };
					default:
						throw { status: 500, error: 'Spotify error' };
				};
			const createPlaylistJsoned = await createPlaylistRaw.json();
			newPlaylist = {
				id: createPlaylistJsoned.id,
				name: createPlaylistJsoned.name,
				owner: createPlaylistJsoned.owner,
				image: createPlaylistJsoned.images[0],
				type: 'playlist',
				tracks: 0
			};
		} catch (e: any) {
			throw {
				status: e.status || 500,
				error: e.error || 'Unknown Spotify Error'
			};
		};

		let targetDetails, differDetails, bothTracks;
		try {
			const results = await Promise.all([
				playlistGetter({ access_token, type: target.type, id: target.id }),
				playlistGetter({ access_token, type: differ.type, id: differ.id })
			]);
			if (results[0].partial)
				success = {
					type: 'partial',
					reasons: [...success.reasons, 'target get was incomplete']
				};
			if (results[1].partial)
				success = {
					type: 'partial',
					reasons: [...success.reasons, 'differ get was incomplete']
				};
			targetDetails = results[0];
			differDetails = results[1];
			bothTracks = targetDetails.total + differDetails.total;
		} catch (e: any) {
			throw { status: e.status || 500, error: e.error || 'Unknown error' };
		};

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

		try {
			const newPlaylistAddResult = await outputAdder({
				access_token,
				id: newPlaylist.id,
				items: diffResult
			});
			if (newPlaylistAddResult.partial === true)
				success = {
					type: 'partial',
					reasons: [
						...success.reasons,
						'New playlist only has a partial result of the diffing operation'
					]
				};
			newPlaylist.tracks = newPlaylistAddResult.total;
		} catch (e: any) {
			throw {
				status: e.status || 500,
				error: e.error || 'Unknown adding to playlist error'
			}
		}

		return res.status(201).json({ success, playlist: newPlaylist });

	} catch (e: any) {
		return res.status(e.status || 500)
			.json({ error: e.error || 'Unknown error' });
	};
};
