import { SERVER_DIFF_TYPES, SPOT_URL_BASE } from '@consts/spotify';
import {
	ActionType,
	MyPlaylistObject,
	SpotTracksResponse,
	differInternalAddPromise,
	differInternalPlaylistPromise
} from '@components/spotify/types';
import { AuthError, FetchError, ForbiddenError, RateError } from './errors';

const userGetter = async (args: {
	accessToken: string,
	globalTimeoutMS: number
}): Promise<string> => {
	return new Promise(async (res, rej) => {
		const { accessToken, globalTimeoutMS } = args;
		const localTimeoutMS = globalTimeoutMS - 2200;
		while (true) {
			try {
				const raw = await fetch(SPOT_URL_BASE.concat('me'),
					{
						headers: {
							'Authorization': `Bearer ${accessToken}`
						}
					});

				if (raw.status === 429) {
					const retry = raw.headers.get('Retry-After');
					const wait = retry !== null ? parseInt(retry) * 1000 : 1000;
					if (Date.now() + wait >= localTimeoutMS) throw new RateError();
					else {
						await new Promise(r => setTimeout(r, wait));
						continue;
					}
				}

				if (raw.ok === false) {
					// This is if somehow after all this, Spotify detects something wrong
					switch (raw.status) {
						case 401:
							throw new AuthError();
						case 403:
							throw new ForbiddenError(`For some reason we can't see your data`);
						default:
							throw new FetchError('Spotify had an error');
					}
				}

				const jsoned = await raw.json();
				res(jsoned.id);
				break;
			} catch (e) {
				rej(e);
				break;
			}
		}
	});
}

const createEmptyPlaylist = async (args: {
	accessToken: string,
	userId: string,
	actionType: ActionType,
	target: { id: string, owner: string, name: string },
	differ: { id: string, owner: string, name: string },
	globalTimeoutMS: number
}): Promise<MyPlaylistObject> => {
	const { accessToken,
		userId,
		actionType,
		globalTimeoutMS,
		target,
		differ } = args;
	const descStr = SERVER_DIFF_TYPES[actionType];
	const url = SPOT_URL_BASE.concat('users/', userId, '/playlists');
	const headers = new Headers();
	headers.append('Authorization', `Bearer ${accessToken}`);
	headers.append('Content-Type', 'application/json');

	return new Promise(async (res, rej) => {
		const localTimeoutMS = globalTimeoutMS - 2200;
		while (true) {
			try {
				const raw = await fetch(url, {
					headers,
					method: 'POST',
					body: JSON.stringify({
						name: `SuperUser ${actionType} ${Math.floor(Date.now() / 1000)}`,
						description: descStr({ target, differ })
					})
				});
				if (raw.status === 429) {
					const retry = raw.headers.get('Retry-After');
					const wait = retry !== null ? parseInt(retry) * 1000 : 1000;
					if (Date.now() + wait >= localTimeoutMS) throw new RateError();
					else {
						await new Promise(r => setTimeout(r, wait));
						continue;
					}
				}

				if (raw.ok === false) {
					// This is if somehow after all this, Spotify detects something wrong
					switch (raw.status) {
						case 401:
							throw new AuthError();
						case 403:
							throw new ForbiddenError(`For some reason you can't create a ` +
								`playlist`);
						default:
							throw new FetchError('Spotify had an error');
					}
				}
				const jsoned = await raw.json();
				res({
					...jsoned,
					image: jsoned.images[0],
					type: 'playlist',
					tracks: 0
				});
				break;
			} catch (e) {
				rej(e);
				break;
			}
		}
	});
}

const playlistGetter = async (args: {
	accessToken: string,
	type: 'playlist' | 'album',
	id: string,
	globalTimeoutMS: number
}) => {
	const { accessToken, type, id, globalTimeoutMS } = args;
	const localTimeoutMS = globalTimeoutMS - 2200;
	return new Promise<differInternalPlaylistPromise>(async (res, rej) => {
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

		// Await random interval so hopefully calls aren't stacked too much
		await new Promise(
			async r => setTimeout(r, Math.floor(Math.random() * 100 + 50))
		);

		// To allow return of partial data in case playlists are too big
		// This promise is part of a global 9 second timeout
		const set: Set<string> = new Set();
		let partial = true;
		// For fetches that are successful but Spotify API returns null for a track
		// For some reason, not sure what causes that
		let apiNull = false;
		let total = 0;
		const localTimeoutMS = globalTimeoutMS - 2200;
		const localTimeout = setTimeout(() => {
			res({
				partial,
				total,
				apiNull,
				items: Array.from(set)
			});
		}, globalTimeoutMS - Date.now() - 2200);

		// Init loop with initNext
		let next = initNext;
		// One retry because for some reason on
		// random playlists, the fetch instantly throws
		let oneRetry = true;
		while (next !== null) {
			try {
				const raw = await fetch(next, { headers });
				if (raw.status === 429) {
					const retryRaw = raw.headers.get('Retry-After');
					const retry = retryRaw !== null ? parseInt(retryRaw) * 1000 : 2000;
					// Throw rate error if wait would pass the timeout time
					if ((Date.now() + retry) < localTimeoutMS) {
						// Await retry if within timeout time
						await new Promise(async r => setTimeout(r, retry));
						continue;
					} else {
						// If rate error hits but some data exists, resolve with that data
						const items = Array.from(set);
						if (items.length > 0) {
							res({
								partial,
								total,
								apiNull,
								items
							});
							break;
						}
						else throw new RateError();
					}
				}

				if (raw.ok === false) {
					// This is if somehow after all this, Spotify detects something wrong
					switch (raw.status) {
						case 401:
							throw new AuthError();
						case 403:
							throw new ForbiddenError(`For some reason, you can't access `
								+ `one of those playlists`);
						default:
							throw new FetchError('Spotify had an error');
					}
				}

				// Add this iteration to set
				// Set next to either new url or null
				const jsoned = await raw.json() as SpotTracksResponse;
				next = jsoned.next;
				total = jsoned.total;
				for (const item of jsoned.items) {
					// Filter for existing and local files;
					// Local files have really weird URIs;
					// Sometimes spotify returns null for a weird non-existing track
					// And this whole thing throws
					if (item === null || item.track.uri === null)
						apiNull = true;
					else if (
						/local/.test(item.track.uri) === false
						&& set.has(item.track.uri) === false)
						set.add(item.track.uri);
				}
				// Reset one retry
				oneRetry = true;
			} catch (e: any) {
				if (oneRetry === true && e.status === undefined) {
					console.log('RETRY', id);
					// Flag retry
					oneRetry = false;
					continue;
				} else {
					rej(e);
					break;
				}
			}
		}
		clearTimeout(localTimeout);
		partial = false;
		res({
			partial,
			apiNull,
			total,
			items: Array.from(set) as string[]
		});
	});
}

const outputAdder = (params: {
	accessToken: string,
	items: Set<string>,
	id: string,
	globalTimeoutMS: number
}) => {
	return new Promise<differInternalAddPromise>(async (res, rej) => {
		const { accessToken, items, id, globalTimeoutMS } = params;

		// Batch the uris into 100s for successive fetch bodies
		const uris = Array.from(items);
		const fetches: string[][] = [];
		// Remainder as a smaller fetch
		const remain = uris.length % 100;
		const hundreds = Math.floor(uris.length / 100);
		for (let i = 0; i < hundreds; i++)
			fetches.push(uris.slice(0 + (100 * i), 100 + (100 * i)));
		// Add remainder if necessary
		if (remain !== 0) fetches.push(uris.slice(0 - remain - 1));

		const headers = new Headers();
		headers.append('Authorization', `Bearer ${accessToken}`);
		headers.append('Content-Type', 'application/json');

		// Create partial flag and total because successive fetches may fail
		// Retry one flag in case of random fails
		let iterations = 1;
		let total = 0;
		let partial = true;
		let retryOne = true;
		const localTimeoutMS = globalTimeoutMS - 200;
		const localTimeout = setTimeout(() => res({ total, partial }),
			globalTimeoutMS - Date.now() - 200);

		for (const uriArr of fetches) {
			while (true) {
				try {
					const raw = await fetch(
						SPOT_URL_BASE.concat('playlists/', id, '/tracks'),
						{
							headers,
							method: 'POST',
							body: JSON.stringify({ uris: uriArr })
						}
					);

					if (raw.status === 429) {
						const retryRaw = raw.headers.get('Retry-After');
						const retry = retryRaw !== null ? parseInt(retryRaw) * 1000 : 2000;
						// Throw rate error if wait would pass the timeout time
						if ((Date.now() + retry) < localTimeoutMS) {
							// Await retry if within timeout time
							await new Promise(async r => setTimeout(r, retry));
							continue;
						} else {
							// If rate error hits but data exists, resolve with that data
							if (total > 0) {
								res({
									partial,
									total
								});
								break;
							}
							else throw new RateError();
						}
					}

					if (raw.ok === false) {
						switch (raw.status) {
							case 401:
								throw new AuthError();
							case 403:
								throw new ForbiddenError(`For some reason, you can't access `
									+ `one of those playlists`);
							default:
								throw new FetchError('Spotify had an error');
						}
					}

					// Add new number to total, either a hundred or the remainder
					if (iterations <= hundreds) total += 100;
					else if (remain > 0) total += remain;
					iterations++;
					// Reset retry one flag
					retryOne = true;
					await new Promise(async r => setTimeout(r, 150));
					break;
				} catch (e: any) {
					if (retryOne === true && e.status === undefined) {
						retryOne = false;
						continue;
					} else {
						rej(e);
						break;
					}
				}
			}
		}
		clearTimeout(localTimeout);
		partial = false;
		res({
			partial,
			total
		});
	});
}

export {
	userGetter,
	createEmptyPlaylist,
	playlistGetter,
	outputAdder
};
