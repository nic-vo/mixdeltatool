import { routeKeyRetriever } from '@/auth/accessKey';
import {
	specificQueryParser,
	spotAlbumObjectParser,
	spotPlaylistObjectParser,
} from '@/lib/validators';
import { handlerWithTimeoutAndAuth, threeRetries } from '@/lib/misc/wrappers';
import { SPOT_LOGIN_WINDOW, SPOT_URL_BASE } from '@/consts/spotify';

import { NextAuthRequest } from 'next-auth/lib';
import {
	MyPlaylistObject,
	SpotAlbumObject,
	SpotPlaylistObject,
} from '@/components/spotify/types';
import { badResponse } from '@/lib/misc/responses';

const RATE_LIMIT_PREFIX = 'GSP';
const RATE_LIMIT_ROLLING_LIMIT = 10;
const RATE_LIMIT_DECAY_SECONDS = 5;

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

		// Validate query parameters
		let id, type;
		try {
			let parsed = specificQueryParser.parse(await req.json());
			id = parsed.id;
			type = parsed.type;
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

		// Check if session is being accessed when access token might not be live
		const { expiresAt, accessToken } = token;
		if (Date.now() - expiresAt < 3600 - SPOT_LOGIN_WINDOW)
			return badResponse(401);

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
				} = spotPlaylistObjectParser.parse(json);
				returner = {
					id,
					name,
					type,
					tracks,
					image: images[0],
					owner: [
						{
							id: owner.id,
							name: owner.display_name || 'Spotify User',
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
