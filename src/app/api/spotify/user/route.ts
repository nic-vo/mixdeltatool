import { z } from 'zod';
import { routeKeyRetriever } from '@/auth/accessKey';
import { handlerWithTimeoutAndAuth, threeRetries } from '@/lib/misc/helpers';
import {
	SPOT_LOGIN_WINDOW,
	SPOT_PLAYLIST_PAGE_LIMIT,
	SPOT_URL_BASE,
} from '@/consts/spotify';

import { NextAuthRequest } from 'next-auth/lib';
import { userPlaylistResponseParser } from '@/lib/spotify/validators';
import badResponse from '@/lib/route_helpers';

const RATE_LIMIT_PREFIX = 'GUP';
const RATE_LIMIT_ROLLING_LIMIT = 10;
const RATE_LIMIT_DECAY_SECONDS = 5;

const queryParamParser = z.coerce
	.number()
	.int()
	.gte(0)
	.lt(SPOT_PLAYLIST_PAGE_LIMIT);

export const maxDuration = 20;

export const GET = handlerWithTimeoutAndAuth(
	{
		maxDuration,
		rateLimit: {
			RATE_LIMIT_DECAY_SECONDS,
			RATE_LIMIT_PREFIX,
			RATE_LIMIT_ROLLING_LIMIT,
		},
	},
	async (req: NextAuthRequest) => {
		if (!req.auth || !req.auth.user || !req.auth.user.id)
			return badResponse(401);

		let page; // Validate query params
		try {
			const attempt = req.nextUrl.searchParams.get('page');
			if (!attempt) throw new Error();
			page = queryParamParser.parse(attempt);
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
		if (Date.now() - expiresAt < 3600 - SPOT_LOGIN_WINDOW)
			return badResponse(401);

		// Hit spotify API with retrieved access token and page from query
		const requestParams = new URLSearchParams({
			offset: `${page * 10}`,
			limit: '10',
		});
		const spotifyResponse = await threeRetries(
			() =>
				fetch(`${SPOT_URL_BASE}me/playlists?${requestParams.toString()}`, {
					headers: { Authorization: `Bearer ${accessToken}` },
				}),
			{
				400: `Spotify couldn't process that request`,
				403: `There was an error accessing your playlists`,
			}
		);
		if (!spotifyResponse.ok) return spotifyResponse;

		// Attempt to pare the data down and return it
		try {
			const json = await spotifyResponse.json();
			const parsed = userPlaylistResponseParser.parse(json);
			const { items } = parsed;
			const next = parsed.next !== null ? page + 1 : null;
			return Response.json(
				{
					next,
					playlists: items.map((item) => {
						const { images, tracks } = item;
						return {
							...item,
							owner: [{ ...item.owner, name: item.owner.display_name }],
							image: images[0],
							tracks: tracks.total,
						};
					}),
				},
				{ status: 200 }
			);
		} catch {
			return badResponse(502, {
				message: `Something was wrong with Spotify's response`,
			});
		}
	}
);
