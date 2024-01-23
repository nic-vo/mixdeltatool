import { SPOT_URL_BASE } from '@consts/spotify';
import {
	AuthError,
	CustomError,
	FetchError,
	ForbiddenError,
	RateError
} from '../errors';

import { localTimeout } from './commonPromises';
import {
	spotAlbumObjectParser,
	spotPlaylistObjectParser,
	userPlaylistResponseParser
} from './validators';

import {
	MyPlaylistObject,
	MyUserAPIRouteResponse,
	SpotAlbumObject,
	SpotPlaylistObject
} from '@components/spotify/types';

const SPOT_PLAYLIST_ITER_INT = 10;

const userPlaylistGetter = async (args: {
	page: number,
	accessToken: string,
	globalTimeoutMS: number
}): Promise<MyUserAPIRouteResponse> => {
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

	return Promise.race([
		localTimeout<MyUserAPIRouteResponse>(globalTimeoutMS, 100),
		new Promise<MyUserAPIRouteResponse>(async (res, rej) => {
			try {
				let response;
				let networkRetry = true;
				while (true) {
					try {
						response = await fetch(url, { headers });
					} catch {
						if (networkRetry === false)
							throw new FetchError('There was an error reaching Spotify');
						networkRetry = false;
						continue;
					}
					networkRetry = true;
					if (response.status === 429) {
						const header = response.headers.get('Retry-After');
						// Retry based on Retry-After header in sec, otherwise 2s wait
						const wait = header !== null ? parseInt(header) * 1000 : 2000;
						// Throw rate error if wait would pass the timeout time
						if ((Date.now() + wait) >= globalTimeoutMS) throw new RateError(10);
						// Await retry if within timeout time
						await new Promise(async r => setTimeout(r, wait));
						// Continue for while loop
						continue;
					}
					break;
				}
				if (!response)
					throw new FetchError('There was an error reaching Spotify');
				if (response.ok === false) {
					// This is if somehow after all this, Spotify detects something wrong
					switch (response.status) {
						case 401:
							throw new AuthError();
						case 403:
							throw new ForbiddenError(`Can't access your playlists`);
						default:
							throw new FetchError('There was an error reaching Spotify');
					}
				}

				let items, next;
				try {
					const jsoned = await response.json();
					const parsed = userPlaylistResponseParser.parse(jsoned);
					items = parsed.items;
					next = parsed.next;
				} catch (e: any) {
					console.error(e);
					throw new FetchError("Something was wrong with Spotify's response");
				}
				return res({
					next,
					playlists: items.map(item => {
						const { images, tracks } = item;
						return {
							...item,
							owner: [{ ...item.owner, name: item.owner.display_name }],
							image: images[0],
							tracks: tracks.total,
						};
					})
				} as MyUserAPIRouteResponse);
			} catch (e: any) {
				return rej(e);
			}
		})]);
}

const specificPlaylistGetter = async (args: {
	type: 'album' | 'playlist',
	id: string,
	accessToken: string,
	globalTimeoutMS: number
}): Promise<MyPlaylistObject> => {
	const { accessToken, type, id, globalTimeoutMS } = args;
	const headers = new Headers();
	headers.append('Authorization', `Bearer ${accessToken}`);
	const url = `${SPOT_URL_BASE}${type}s/${id}`;

	return Promise.race([
		localTimeout<MyPlaylistObject>(globalTimeoutMS, 100),
		new Promise<MyPlaylistObject>(async (res, rej) => {
			try {
				let response;
				let networkRetry = true;
				while (true) {
					try {
						response = await fetch(url, { headers });
					} catch {
						if (networkRetry === false)
							throw new FetchError('There was an error reaching Spotify');
						networkRetry = false;
						continue;
					}
					networkRetry = true;
					if (response.status === 429) {
						const header = response.headers.get('Retry-After');
						// Retry based on Retry-After header in sec, otherwise 2s wait
						const wait = header !== null ? parseInt(header) * 1000 : 2000;
						// Throw rate error if wait would pass the timeout time
						if ((Date.now() + wait) >= globalTimeoutMS) throw new RateError(10);
						// Await retry if within timeout time
						await new Promise(async r => setTimeout(r, wait));
						// Continue for while loop
						continue;
					}
					break;
				}
				if (!response)
					throw new FetchError('There was an error reaching Spotify');
				if (response.ok === false) {
					// This is if somehow after all this, Spotify detects something wrong
					switch (response.status) {
						case 401:
							throw new AuthError();
						case 403:
							throw new ForbiddenError(`Spotify forbids that playlist`);
						case 404:
							throw new CustomError(404, 'That Spotify ID does not exist');
						default:
							throw new FetchError('Verify that link is valid');
					}
				}

				let returner: MyPlaylistObject;
				try {
					// User may submit a playlist or an album
					const jsoned: SpotAlbumObject | SpotPlaylistObject = await response.json();
					if (jsoned.type === 'album') {
						const parsed = spotAlbumObjectParser.parse(jsoned);
						returner = {
							...parsed,
							image: parsed.images[0],
							owner: parsed.artists.map(artist => {
								const { name, id } = artist;
								return { name, id }
							}),
							tracks: parsed.total_tracks,
						};
					} else if (jsoned.type === 'playlist') {
						const parsed = spotPlaylistObjectParser.parse(jsoned);
						returner = {
							...parsed,
							image: parsed.images[0],
							tracks: parsed.tracks.total,
							owner: [{ ...parsed.owner, name: parsed.owner.display_name ||'Spotify User' }]
						};
					} else throw new Error();
				} catch (e: any) {
					throw new CustomError(404, 'That was not a valid playlist');
				}
				return res(returner);
			} catch (e: any) {
				return rej(e);
			}
		})]);
}

export {
	userPlaylistGetter,
	specificPlaylistGetter
};
