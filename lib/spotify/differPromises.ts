import { SPOT_URL_BASE } from '@consts/spotify';
import {
	ActionType,
	MyPlaylistObject,
	SpotTracksResponse,
	differInternalAddPromise,
	differInternalPlaylistPromise
} from '@components/spotify/types';
import { AuthError, CustomError, FetchError, ForbiddenError, RateError } from './errors';
import { localTimeout } from './commonPromises';
import { spotPlaylistObjectParser, spotUserObjectParser } from './validators';

const userGetter = async (args: {
	accessToken: string,
	globalTimeoutMS: number
}): Promise<string> => {
	const { accessToken, globalTimeoutMS } = args;
	const localLimit = 2200;
	const localTimeoutMS = globalTimeoutMS - localLimit;
	const url = SPOT_URL_BASE.concat('me');
	const headers = new Headers();
	headers.append('Authorization', `Bearer ${accessToken}`);

	return Promise.race([
		localTimeout<string>(globalTimeoutMS, localLimit),
		new Promise<string>(async (res, rej) => {
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
						const tryHeader = response.headers.get('Retry-After');
						// Retry based on Retry-After header in sec, otherwise 2s wait
						const retry = tryHeader !== null ? parseInt(tryHeader) * 1000 : 2000;
						// Throw rate error if wait would pass the timeout time
						if ((Date.now() + retry) >= localTimeoutMS) throw new RateError();
						// Await retry if within timeout time
						await new Promise(async r => setTimeout(r, retry));
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
							throw new ForbiddenError(`We can't find you`);
						default:
							throw new FetchError('There was an error reaching Spotify');
					}
				}

				let id;
				try {
					const jsoned = await response.json();
					const parsed = spotUserObjectParser.parse(jsoned);
					id = parsed.id;
				} catch {
					throw new FetchError("There was an error with Spotify's response");
				}
				return res(id as string);
			} catch (e: any) {
				return rej(e);
			}
		})]);
}

const createEmptyPlaylist = async (args: {
	accessToken: string,
	userId: string,
	actionType: ActionType,
	baseDescStr: string,
	globalTimeoutMS: number
}): Promise<MyPlaylistObject> => {
	const { accessToken,
		userId,
		actionType,
		globalTimeoutMS,
		baseDescStr } = args;
	const localLimit = 2200;
	const localTimeoutMS = globalTimeoutMS - 2200;
	const url = SPOT_URL_BASE.concat('users/', userId, '/playlists');
	const headers = new Headers();
	headers.append('Authorization', `Bearer ${accessToken}`);
	headers.append('Content-Type', 'application/json');

	return Promise.race([
		localTimeout<MyPlaylistObject>(globalTimeoutMS, localLimit),
		new Promise<MyPlaylistObject>(async (res, rej) => {
			try {
				let response;
				let networkRetry = true;
				while (true) {
					try {
						response = await fetch(url, {
							headers,
							method: 'POST',
							body: JSON.stringify({
								name: `SuperUser ${actionType} ${Math.floor(Date.now() / 1000)}`,
								description: baseDescStr
							})
						});
					} catch {
						if (networkRetry === false)
							throw new FetchError('There was an error creating a new playlist');
						networkRetry = false;
						continue;
					}
					networkRetry = true;
					if (response.status === 429) {
						const header = response.headers.get('Retry-After');
						const wait = header !== null ? parseInt(header) * 1000 : 1000;
						if (Date.now() + wait >= localTimeoutMS) throw new RateError();
						await new Promise(r => setTimeout(r, wait));
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
							throw new ForbiddenError(`For some reason you can't create a ` +
								`playlist`);
						default:
							throw new FetchError('There was an error creating a new playlist');
					}
				}
				let returner: MyPlaylistObject;
				try {
					const jsoned = await response.json();
					const parsed = spotPlaylistObjectParser.parse(jsoned);
					returner = {
						...parsed,
						image: parsed.images[0],
						tracks: 0
					};
				} catch {
					throw new FetchError('There was an error creating a new playlist');
				}
				return res(returner);
			} catch (e: any) {
				return rej(e);
			}
		})]);
}

const playlistGetter = async (args: {
	accessToken: string,
	type: 'playlist' | 'album',
	id: string,
	globalTimeoutMS: number
}): Promise<differInternalPlaylistPromise> => {
	const { accessToken, type, id, globalTimeoutMS } = args;
	const localLimit = 2200;
	const localTimeoutMS = globalTimeoutMS - localLimit;

	return Promise.race([
		localTimeout<differInternalPlaylistPromise>(globalTimeoutMS, localLimit),
		new Promise<differInternalPlaylistPromise>(async (res, rej) => {
			// Initial url for fetching
			const base = SPOT_URL_BASE.concat(type, 's/', id, '/tracks?');
			const params = new URLSearchParams();
			params.append('offset', '0');
			params.append('limit', '50');
			if (type === 'playlist')
				params.append('fields', 'next,total,items(track(uri))');
			const initNext = base.concat(params.toString());

			const headers = new Headers();
			headers.append('Authorization', `Bearer ${accessToken}`);

			// To allow return of partial data in case playlists are too big
			// This promise is part of a global 9 second timeout
			const set: Set<string> = new Set();
			// For fetches that are successful but Spotify API returns null for a track
			// For some reason, not sure what causes that
			let completed = 0;
			let total = 0;
			// Init loop with initNext
			let next = initNext;
			// One retry because for some reason on
			// random playlists, the fetch instantly throws
			try {
				while (next !== null && (Date.now() + 500) < localTimeoutMS) {
					let response;
					let networkRetry = true;
					while (true) {
						try {
							response = await fetch(next, { headers });
						} catch {
							if (networkRetry === false)
								throw new FetchError('There was an error getting a playlist');
							networkRetry = false;
							continue;
						}
						break;
					}
					networkRetry = true;
					if (response.status === 429) {
						const header = response.headers.get('Retry-After');
						const wait = header !== null ? parseInt(header) * 1000 : 2000;
						// Throw rate error if wait would pass the timeout time
						if ((Date.now() + wait) > localTimeoutMS) {
							// Break early from rate limit if data exists
							if (set.size > 0) break;
							throw new RateError();
						}
						// Await retry if within timeout time
						await new Promise(async r => setTimeout(r, wait));
						continue;
					}
					if (response.ok === false) {
						// This is if somehow after all this, Spotify detects something wrong
						switch (response.status) {
							case 401:
								throw new AuthError();
							case 403:
								throw new ForbiddenError(`For some reason, you can't access `
									+ `one of those playlists`);
							case 404:
								throw new CustomError(404, `One of those playlists doesn't exist`);
							default:
								throw new FetchError('Spotify had an error');
						}
					}
					if (!response)
						throw new FetchError('There was an error getting a response ' +
							'from Spotify');
					// Add this iteration to set
					// Set next to either new url or null
					const jsoned = await response.json() as SpotTracksResponse;
					for (const item of jsoned.items) {
						// Filter for existing and local files;
						// Local files have really weird URIs;
						// Sometimes spotify returns null for a weird non-existing track
						// And this whole thing throws
						if (item === null
							|| item.track === null
							|| item.track.uri === null
							|| /local/.test(item.track.uri) === true
							|| set.has(item.track.uri) === true) {
							continue;
						}
						// Show that some tracks returned null for some reason
						// Don't increment completed
						set.add(item.track.uri);
						completed += 1;
					}
					next = jsoned.next;
					total = total === 0 ? jsoned.total : total;
				}
			} catch (e: any) {
				return rej(e);
			}

			return res({
				total,
				completed,
				items: Array.from(set) as string[]
			});
		})]);
}

const outputAdder = (params: {
	accessToken: string,
	items: Set<string>,
	id: string,
	globalTimeoutMS: number
}) => {
	const { accessToken, items, id, globalTimeoutMS } = params;
	const localLimit = 200;
	const localTimeoutMS = globalTimeoutMS - localLimit;
	const url = SPOT_URL_BASE.concat('playlists/', id, '/tracks');

	return Promise.race<differInternalAddPromise>([
		localTimeout<differInternalAddPromise>(globalTimeoutMS, localLimit),
		new Promise<differInternalAddPromise>(async (res, rej) => {
			// Batch the uris into 100s for successive fetch bodies
			const uris = Array.from(items);
			const fetches: string[][] = [];
			// Remainder as a smaller fetch
			const remain = uris.length % 100;
			const hundreds = Math.floor(uris.length / 100);
			for (let i = 0; i < hundreds; i++)
				fetches.push(uris.slice(0 + (100 * i), 100 + (100 * i)));
			// Add remainder if necessary
			if (remain !== 0) fetches.push(uris.slice(0 - remain));

			const headers = new Headers();
			headers.append('Authorization', `Bearer ${accessToken}`);
			headers.append('Content-Type', 'application/json');

			// Create partial flag and total because successive fetches may fail
			// Retry one flag in case of random fails
			let iterations = 1;
			const total = uris.length;
			let completed = 0;

			for (const uriArr of fetches) {
				// Arbitrary early break just in case time might go over
				if (Date.now() + 220 > localTimeoutMS) break;
				let response;
				let networkRetry = true;
				while (true) {
					try {
						response = await fetch(url,
							{
								headers,
								method: 'POST',
								body: JSON.stringify({ uris: uriArr })
							}
						);
					} catch {
						if (networkRetry === false)
							throw new FetchError('There was an error adding tracks to the'
								+ 'new playlist');
						networkRetry = false;
						continue;
					}
					break;
				}
				networkRetry = true;
				if (response.status === 429) {
					const header = response.headers.get('Retry-After');
					const wait = header !== null ? parseInt(header) * 1000 : 2000;
					// Throw rate error if wait would pass the timeout time
					if ((Date.now() + wait) > localTimeoutMS) {
						// Break early from rate limit if data exists
						if (completed > 0) break;
						throw new RateError();
					}
					// Await retry if within timeout time
					await new Promise(async r => setTimeout(r, wait));
					continue;
				}
				if (response.ok === false) {
					// This is if somehow after all this, Spotify detects something wrong
					switch (response.status) {
						case 401:
							throw new AuthError();
						case 403:
							throw new ForbiddenError(`For some reason, you can't access the `
								+ `playlist`);
						default:
							throw new FetchError('There was an error populating the playlist');
					}
				}
				if (!response)
					throw new FetchError('There was an error getting a response ' +
						'from Spotify');
				// Add new number to completed, either a hundred or the remainder
				if (iterations <= hundreds) completed += 100;
				else if (remain > 0) completed += remain;
				iterations += 1;
			}
			return res({
				total,
				completed
			});
		})]);
}

const updateDescription = (params: {
	accessToken: string,
	globalTimeoutMS: number,
	id: string,
	baseDescStr: string,
	reasons: string[]
}): Promise<string | null> => {
	const {
		accessToken,
		id,
		globalTimeoutMS,
		reasons,
		baseDescStr
	} = params;
	const localLimit = 200;
	const localTimeoutMS = globalTimeoutMS - localLimit;
	const headers = new Headers();
	headers.append('Authorization', `Bearer ${accessToken}`);
	headers.append('Content-Type', 'application/json');
	const failMsg = "Diff completed but couldn't update playlist description";

	return new Promise<string | null>(async res => {
		while (Date.now() + 220 < localTimeoutMS) {
			try {
				let response;
				try {
					response = await fetch(SPOT_URL_BASE.concat('playlists/', id), {
						method: 'PUT',
						headers,
						body: JSON.stringify(
							{ description: baseDescStr.concat(' ', reasons.join(' ')) }
						)
					})
				} catch {
					continue;
				}

				if (response.status === 429) {
					const retryRaw = response.headers.get('Retry-After');
					const retry = retryRaw !== null ? parseInt(retryRaw) * 1000 : 2000;
					// Throw rate error if wait would pass the timeout time
					if ((Date.now() + retry) < localTimeoutMS) {
						// Await retry if within timeout time
						await new Promise(async r => setTimeout(r, retry));
						continue;
					} else throw new Error();
				}
				if (response.ok === false) throw new Error();
				return res(null);
			} catch {
				continue;
			}
		}
		return res(failMsg);
	});
}

export {
	userGetter,
	createEmptyPlaylist,
	playlistGetter,
	outputAdder,
	updateDescription
};
