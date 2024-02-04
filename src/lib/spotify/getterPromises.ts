import { SPOT_URL_BASE } from '@consts/spotify';
import {
	FetchError,
	NotFoundError,
} from '../errors';

import { getOnePromise, localTimeout } from './commonPromises';
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
	const parentTimeoutMS = globalTimeoutMS - 100;

	const headers = new Headers();
	const params = new URLSearchParams({
		offset: offset.toString(),
		limit: SPOT_PLAYLIST_ITER_INT.toString()
	});
	headers.append('Authorization', `Bearer ${accessToken}`);
	const url = `${SPOT_URL_BASE}me/playlists?${params.toString()}`;

	return Promise.race([
		localTimeout<MyUserAPIRouteResponse>(parentTimeoutMS),
		(async (): Promise<MyUserAPIRouteResponse> => {
			const request = fetch(url, { headers });
			const response = await getOnePromise({
				request, silentFail: false, parentTimeoutMS,
				errorOverrides: [
					{ status: 403, message: "Can't access your playlists." },
					{ status: 404, message: "Can't find you, somehow." }
				]
			});
			let items, next;
			try {
				const jsoned = await response.json();
				const parsed = userPlaylistResponseParser.parse(jsoned);
				items = parsed.items;
				next = parsed.next !== null ? page + 1 : null;
			} catch (e: any) {
				throw new FetchError("Something was wrong with Spotify's response");
			}
			return {
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
			} as MyUserAPIRouteResponse;
		})()]);
}

const specificPlaylistGetter = async (args: {
	type: 'album' | 'playlist',
	id: string,
	accessToken: string,
	globalTimeoutMS: number
}): Promise<MyPlaylistObject> => {
	const { accessToken, type, id, globalTimeoutMS } = args;
	const parentTimeoutMS = globalTimeoutMS - 100
	const headers = new Headers();
	headers.append('Authorization', `Bearer ${accessToken}`);
	const url = `${SPOT_URL_BASE}${type}s/${id}`;

	return Promise.race([
		localTimeout<MyPlaylistObject>(parentTimeoutMS),
		(async () => {
			const request = fetch(url, { headers });
			const response = await getOnePromise({
				request, silentFail: false, parentTimeoutMS,
				errorOverrides: [
					{ status: 403, message: "Spotify forbids that playlist." },
					{ status: 404, message: "Info is wrong / playlist doesn't exist." }
				]
			});
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
						owner: [{
							...parsed.owner,
							name: parsed.owner.display_name || 'Spotify User'
						}]
					};
				} else throw new Error();
			} catch {
				throw new NotFoundError('That was not a valid playlist.');
			}
			return returner;
		})()]);
}

export {
	userPlaylistGetter,
	specificPlaylistGetter
};
