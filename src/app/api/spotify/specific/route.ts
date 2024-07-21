import { routeKeyRetriever } from '@/auth/accessKey';
import {
	idParamParser,
	spotAlbumObjectParser,
	playlistObjectParser,
} from '@/lib/validators';
import {
	handlerWithTimeoutAndAuth,
	threeRetries,
} from '@/lib/route_helpers/wrappers';
import { SPOT_URL_BASE } from '@/consts/spotify';
import { z } from 'zod';
import { badResponse } from '@/lib/route_helpers/responses';

import type {
	MyPlaylistObject,
	SpotAlbumObject,
	SpotPlaylistObject,
} from '@/lib/validators';
import type { NextAuthRequest } from 'next-auth/lib';

const rateLimit = {
	RATE_LIMIT_PREFIX: 'GSP',
	RATE_LIMIT_ROLLING_LIMIT: 10,
	RATE_LIMIT_DECAY_SECONDS: 5,
};
export const maxDuration = 20;

const typeParser = z.enum(['playlist', 'album']);

export const GET = handlerWithTimeoutAndAuth(
	{
		maxDuration,
		rateLimit,
	},
	async (req: NextAuthRequest) => {
		if (!req.auth || !req.auth.user || !req.auth.user.id)
			return badResponse(401);

		// Validate query parameters
		let id, type;
		try {
			id = idParamParser.parse(req.nextUrl.searchParams.get('id'));
			type = typeParser.parse(req.nextUrl.searchParams.get('type'));
		} catch {
			return badResponse(404);
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

		// Hit spotify API with retrieved access token
		const spotifyResponse = await threeRetries(
			() =>
				fetch(`${SPOT_URL_BASE}${type}s/${id}`, {
					headers: { Authorization: `Bearer ${accessToken}` },
				}),
			{
				403: 'Spotify forbids that playlist',
				404: `Your info is wrong or that playlist / album doesn't exist`,
			}
		);
		if (!spotifyResponse.ok) return spotifyResponse;

		// Attempt to pare the data down and return it
		try {
			const json: SpotAlbumObject | SpotPlaylistObject =
				await spotifyResponse.json();
			let returner: MyPlaylistObject;
			if (json.type === 'album') {
				const {
					id,
					name,
					total_tracks: tracks,
					type,
					artists,
					images,
				} = spotAlbumObjectParser.parse(json);
				returner = {
					id,
					name,
					tracks,
					type,
					owner: artists.map(({ name, id }) => {
						return { name, id };
					}),
					image: images[0],
				};
			} else if (json.type === 'playlist') {
				const {
					id,
					name,
					type,
					images,
					owner,
					tracks: { total: tracks },
				} = playlistObjectParser.parse(json);
				returner = {
					id,
					name,
					type,
					tracks,
					image: (images && images[0]) ?? null,
					owner: [
						{
							id: owner.id,
							name: owner.display_name,
						},
					],
				};
			} else throw new Error();
			return Response.json(returner, { status: 200 });
		} catch {
			return badResponse(502, {
				message: `Something was wrong with Spotify's response`,
			});
		}
	}
);
