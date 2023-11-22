import { SPOT_PLAYLIST_ITER_INT, SPOT_URL_BASE } from '@consts/spotify';
import {
	AuthError,
	CustomError,
	FetchError,
	ForbiddenError,
	RateError,
	TimeoutError
} from './errors';

import {
	MyPlaylistObject,
	MyUserAPIRouteResponse,
	SpotAlbumObject,
	SpotPlaylistObject,
	SpotUserPlaylistsResponse
} from '@components/spotify/types';

const userPlaylistGetter = async (args: {
	page: number,
	accessToken: string,
	globalTimeoutMS: number
}) => {
	// Timeout MS reflects global timeout in Next.js Handler
	// Unknown how long it would take to get to this fetch function
	// So calculate local timeout based on whenever control gets passed to this
	const { page, accessToken, globalTimeoutMS } = args;
	// For pagination passed from user data
	const offset = SPOT_PLAYLIST_ITER_INT * page;

	const headers = new Headers();
	const params = new URLSearchParams({
		offset: offset.toString(),
		limit: SPOT_PLAYLIST_ITER_INT.toString()
	});
	headers.append('Authorization', `Bearer ${accessToken}`);
	const url = `${SPOT_URL_BASE}me/playlists?${params.toString()}`;

	return new Promise(async (res, rej) => {
		const localTimeout = setTimeout(
			() => rej(new TimeoutError()),
			globalTimeoutMS - Date.now() - 100
		);

		while (true) {
			try {
				const raw = await fetch(url, { headers });
				if (raw.status === 429) {
					const retryRaw = raw.headers.get('Retry-After');
					// Retry based on Retry-After header in sec, otherwise 2s wait
					const retry = retryRaw !== null ? parseInt(retryRaw) * 1000 : 2000;
					// Throw rate error if wait would pass the timeout time
					if ((Date.now() + retry) >= globalTimeoutMS)
						throw new RateError();
					else {
						// Await retry if within timeout time
						await new Promise(async r => setTimeout(r, retry));
						// Continue for while loop
						continue;
					}
				}

				if (raw.ok === false) {
					// This is if somehow after all this, Spotify detects something wrong
					switch (raw.status) {
						case 401:
							throw new AuthError();
						case 403:
							throw new ForbiddenError(`Forbidden by Spotify`);
						default:
							throw new FetchError('Spotify had an error');
					}
				}

				const jsoned = await raw.json() as SpotUserPlaylistsResponse;
				const items = jsoned.items as SpotPlaylistObject[];
				const returner = {
					next: jsoned.next ? 1 : null,
					playlists: items.map(item => {
						const { id, images, name, owner, tracks, type } = item;
						return {
							id,
							image: images[0],
							name,
							owner,
							tracks: tracks.total,
							type
						};
					})
				} as MyUserAPIRouteResponse;
				clearTimeout(localTimeout);
				res(returner);
				break;
			} catch (e: any) {
				clearTimeout(localTimeout);
				rej(e);
				break;
			}
		}
	});
}

const specificPlaylistGetter = async (args: {
	type: 'album' | 'playlist',
	id: string,
	accessToken: string,
	globalTimeoutMS: number
}) => {
	const { accessToken, type, id, globalTimeoutMS } = args;
	const headers = new Headers();
	headers.append('Authorization', `Bearer ${accessToken}`);
	const url = `${SPOT_URL_BASE}${type}s/${id}`;

	return new Promise(async (res, rej) => {
		const localTimeout = setTimeout(
			() => rej(new TimeoutError()),
			globalTimeoutMS - Date.now() - 100
		);

		while (true) {
			try {
				let returner: MyPlaylistObject;
				const raw = await fetch(url, { headers: headers });
				if (raw.status === 429) {
					const retryRaw = raw.headers.get('Retry-After');
					const retry = retryRaw !== null ? parseInt(retryRaw) * 1000 : 2000;
					// Throw rate error if wait would pass the timeout time
					if ((Date.now() + retry) >= globalTimeoutMS)
						throw new RateError();
					else {
						// Await retry if within timeout time
						await new Promise(async r => setTimeout(r, retry));
						continue;
					}
				}

				if (raw.ok === false) {
					// This is if somehow after all this, Spotify detects something wrong
					switch (raw.status) {
						case 401:
							throw new AuthError();
						case 403:
							throw new ForbiddenError(`Forbidden by Spotify`);
						case 404:
							throw new CustomError(404, 'That Spotify ID does not exist');
						default:
							throw new FetchError('Spotify had an error');
					}
				}

				// User may submit a playlist or an album
				const jsoned = await raw.json();
				if (jsoned.type === 'album') {
					const ra = jsoned as SpotAlbumObject;
					returner = {
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
				} else {
					const rp = jsoned as SpotPlaylistObject;
					returner = {
						image: rp.images[0],
						id: rp.id,
						name: rp.name,
						owner: rp.owner,
						tracks: rp.tracks.total,
						type: rp.type
					};
				}

				clearTimeout(localTimeout);
				res(returner);
				break;
			} catch (e: any) {
				clearTimeout(localTimeout);
				rej(e);
				break;
			}
		}
	});
}

export {
	userPlaylistGetter,
	specificPlaylistGetter
};
