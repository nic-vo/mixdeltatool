import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';

import { authOptions } from '@lib/auth/options';
import { routeKeyRetriever } from '@lib/auth/accessKey';

import {
	SPOT_LOGIN_WINDOW,
	SPOT_PLAYLIST_ITER_INT,
	SPOT_PLAYLIST_PAGE_LIMIT
} from '@consts/spotify';

import {
	MySpotifyAPIRouteResponse,
	MySpotifyPlaylistObject,
	SpotifyPlaylistObject,
	SpotifyUserPlaylistsResponse
} from '@components/spotify/types';

interface getPlayListsApiRequest extends Omit<NextApiRequest, 'query'> {
	query: { page: string }
};

// The assumption for this route is that every sign-on refreshes access token
// Session never updates, and only exists until access token expiry

export default async function handler(
	req: getPlayListsApiRequest, res: NextApiResponse
) {
	try {
		// Validate req method
		if (req.method !== 'GET')
			throw { status: 405, error: 'GET only' };
		// Validate query parameters
		if (Object.keys(req.query).length !== 1
			|| Object.keys(req.query).includes('page') === false)
			throw { status: 400, error: 'Bad request' };
		// Should only request page, which should be 0 <= page <= 19
		const page = parseInt(req.query.page, 10);
		if (isNaN(page) === true || page < 0 || page > SPOT_PLAYLIST_PAGE_LIMIT)
			throw { status: 422, error: 'Bad request' };

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
			const offset = SPOT_PLAYLIST_ITER_INT * page;
			const headers = new Headers();
			const params = new URLSearchParams({
				offset: offset.toString(),
				limit: SPOT_PLAYLIST_ITER_INT.toString()
			});
			headers.append('Authorization', `Bearer ${access_token}`);
			const rawSpotify = await fetch(
				`https://api.spotify.com/v1/me/playlists?${params.toString()}`, {
				headers: headers
			});
			if (rawSpotify.ok === false) {
				// This is if somehow after all this, Spotify detects something wrong
				const jsoned = await rawSpotify.json();
				console.log('\n***SPOTIFY ERROR***\n');
				console.error(jsoned.error);
				throw '';
			};
			//
			const jsoned = await rawSpotify.json() as SpotifyUserPlaylistsResponse;
			const { next, total } = jsoned;
			const items = jsoned.items as SpotifyPlaylistObject[];
			const returnItems: MySpotifyAPIRouteResponse = {
				next, total,
				playlists: items.map(item => {
					const { id, images, name, owner, tracks } = item;
					return {
						id, image: images[0], name, owner, tracks
					} as MySpotifyPlaylistObject;
				})
			};
			return res.status(200).json(returnItems);
		} catch (e) {
			console.error(e);
			throw { status: 502, error: 'Spotify error' };
		};
	} catch (e: any) {
		if (e.status && e.error) {
			return res.status(e.status).json({ error: e.error });
		} else {
			return res.status(500).json({ error: 'Unknown error' })
		}
	};
};
