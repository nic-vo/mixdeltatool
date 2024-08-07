import { z } from 'zod';
import { routeKeyRetriever } from '@/auth/accessKey';
import {
	handlerWithTimeoutAndAuth,
	threeRetries,
} from '@/lib/route_helpers/wrappers';
import { userPlaylistResponseParser } from '@/lib/validators';
import { badResponse } from '@/lib/route_helpers/responses';
import { SPOT_PLAYLIST_PAGE_LIMIT, SPOT_URL_BASE } from '@/consts/spotify';

import { NextAuthRequest } from 'next-auth/lib';

const rateLimit = {
	RATE_LIMIT_PREFIX: 'GUP',
	RATE_LIMIT_ROLLING_LIMIT: 10,
	RATE_LIMIT_DECAY_SECONDS: 5,
};
const queryParamParser = z.coerce
	.number()
	.int()
	.gte(0)
	.lt(SPOT_PLAYLIST_PAGE_LIMIT);

export const maxDuration = 20;

export const GET = handlerWithTimeoutAndAuth(
	{
		maxDuration,
		rateLimit,
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
		const { accessToken } = token;

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
						const { images, tracks, name, owner, type, id } = item;
						return {
							id,
							type,
							name,
							owner: [{ id: owner.id, name: owner.display_name }],
							image: (images && images[0]) ?? null,
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
