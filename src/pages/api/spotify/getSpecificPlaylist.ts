import { NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';

import { authOptions } from '@lib/auth/options';
import { routeKeyRetriever } from '@lib/auth/accessKey';

import { SPOT_LOGIN_WINDOW, SPOT_URL_BASE } from '@consts/spotify';

import {
	MyPlaylistObject,
	SpotAlbumObject,
	SpotPlaylistObject,
	getSpecificPlaylistApiRequest
} from '@components/spotify/types';
import { playlistIdTypeParser } from '@lib/spotify/validators';

import { ZodError } from 'zod/lib';


// The assumption for this route is that every sign-on refreshes access token
// Session never updates, and only exists until access token expiry

export default async function handler(
	req: getSpecificPlaylistApiRequest, res: NextApiResponse
) {
	try {
		// Validate req method
		if (req.method !== 'GET')
			throw { status: 405, error: 'GET only' };
		// Validate query parameters
		try {
			playlistIdTypeParser.parse(req.query);
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
		try {
			token = await routeKeyRetriever(session.user.id);
		} catch {
			throw { status: 502, error: 'Network error' };
		};
		// No token means that user account somehow unlinked => client redirect
		if (token === null) throw { status: 401, error: 'Unauthorized' };

		// Check if session is being accessed when access token might not be live
		const { expires_at, access_token } = token;
		if (expires_at === undefined
			|| Date.now() - expires_at < 3600 - SPOT_LOGIN_WINDOW)
			throw { status: 401, error: 'Unauthorized' };

		// Hit spotify API with retrieved access token
		try {
			const headers = new Headers();
			headers.append('Authorization', `Bearer ${access_token}`);
			const rawSpotify = await fetch(
				`${SPOT_URL_BASE}${req.query.type}s/${req.query.id}`, {
				headers: headers
			});
			if (rawSpotify.ok === false) {
				// This is if somehow after all this, Spotify detects something wrong
				switch (rawSpotify.status) {
					case 401:
						throw { status: 401, error: 'Unauthorized' };
					case 403:
						throw { status: 401, error: 'Unauthorized' };
					case 429:
						throw { status: 429, error: 'Try again in a few minutes' };
					default:
						throw { status: 500, error: 'Spotify error' };
				};
			};
			// There's a chance a user submits a non-playlist
			const jsoned = await rawSpotify.json();
			switch (jsoned.type) {
				case 'playlist':
					const rp = jsoned as SpotPlaylistObject;
					const returnrp: MyPlaylistObject = {
						image: rp.images[0],
						id: rp.id,
						name: rp.name,
						owner: rp.owner,
						tracks: rp.tracks.total,
						type: rp.type
					};
					return res.status(200).json(returnrp);
				case 'album':
					const ra = jsoned as SpotAlbumObject;
					const returnra: MyPlaylistObject = {
						image: ra.images[0],
						id: ra.id,
						name: ra.name,
						owner: {
							display_name: ra.artists.map((artist) => artist.name).join(', '),
							href: ra.artists[0].href,
							id: ra.artists[0].id,
							uri: ra.artists[0].uri
						},
						tracks: ra.total_tracks,
						type: ra.type
					};
					return res.status(200).json(returnra);
				default:
					throw { status: 422, error: "This isn't a playlist or an album." };
			}

		} catch (e: any) {
			console.error(e);
			throw { status: e.status || 500, error: e.error || 'Spotify error' };
		};
	} catch (e: any) {
		return res.status(e.status || 500)
			.json({ error: e.error || 'Unknown error' });
	};
};
