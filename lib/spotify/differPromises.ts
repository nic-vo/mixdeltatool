import { SPOT_URL_BASE } from '@consts/spotify';
import {
	SpotTracksResponse,
	differInternalAddPromise,
	differInternalPlaylistPromise
} from '@components/spotify/types';

async function playlistGetter(params: {
	access_token: string,
	type: 'playlist' | 'album',
	id: string
}) {
	const { access_token, type, id } = params;

	const url = SPOT_URL_BASE.concat(type, 's/', id, '/tracks');
	const offset = ['offset', '0'];
	const limit = ['limit', '50'];
	const fields = ['fields', 'next,total,items(track(id,href,uri))'];
	const qParams = new URLSearchParams();
	qParams.append(offset[0], offset[1]);
	qParams.append(limit[0], limit[1]);
	if (type === 'playlist') qParams.append(fields[0], fields[1]);

	return new Promise<differInternalPlaylistPromise>(async (res, rej) => {
		const set: Set<string> = new Set();
		let partial = true;
		let total = 0;

		const earlyTimeout = setTimeout(() => {
			console.log(`fetching aborted`);
			res({
				partial,
				total,
				items: Array.from(set)
			});
		}, 5000);

		const headers = new Headers();
		headers.append('Authorization', `Bearer ${access_token}`);
		let next = url.concat(qParams.toString());

		while (next !== null) {
			console.log(`\n***NEW AWAIT***\n${id}\n${next}\n`);
			try {
				const itRaw = await fetch(next, { headers });

				if (itRaw.status === 401 || itRaw.status === 403)
					throw { status: 401, error: 'Unauthorized' };
				if (itRaw.status === 429) {
					const period = parseInt(itRaw.headers.get('Retry-After')!) + 0.1;
					await new Promise(async (r) => setTimeout(() => r, period * 1000));
					continue;
				};
				if (itRaw.ok === false)
					throw { status: 500, error: 'Spotify error' };

				const itJsoned = await itRaw.json() as SpotTracksResponse;
				next = itJsoned.next;
				if (total === 0) total = itJsoned.total;
				for (const track of itJsoned.items)
					if (set.has(track.uri) === false) set.add(track.uri);

			} catch (e: any) {
				rej({
					status: e.status || 500,
					error: (e.error && `Error getting ${id}: ${e.error}`)
						|| `Error getting ${id}`
				});
			};
		};
		clearTimeout(earlyTimeout);
		partial = false;
		res({
			partial,
			total,
			items: Array.from(set) as string[]
		});
	});
};

async function outputAdder(params: {
	access_token: string,
	items: Set<string>,
	id: string
}) {
	const { access_token, items, id } = params;

	const uris = Array.from(items);
	const fetches: string[][] = [];
	const remain = uris.length % 100;
	const hundreds = Math.floor(uris.length / 100);
	for (let i = 0; i < hundreds; i++) {
		fetches.push(uris.slice(0 + (100 * i), 100 * i));
	};
	if (fetches.length % 100 !== 0)
		fetches.push(uris.slice(0 + (100 * hundreds)));
	const headers = new Headers();
	headers.append('Authorization', `Bearer ${access_token}`);
	headers.append('Content-Type', 'application/json');

	return new Promise<differInternalAddPromise>(async (res, rej) => {
		let iterations = 1;
		let total = 0;
		let partial = true;
		const earlyTimeout = setTimeout(() => res({ partial, total }), 3000);

		for (const uriArr of fetches) {
			while (true) {
				try {
					const addRaw = await fetch(
						SPOT_URL_BASE.concat('playlists/', id, '/tracks'),
						{
							headers,
							method: 'POST',
							body: JSON.stringify(uriArr)
						}
					);
					if (addRaw.ok === false)
						switch (addRaw.status) {
							case 401:
							case 403:
								throw { status: 401, error: 'Unauthorized' };
							case 429:
								const period = parseInt(addRaw.headers.get('Retry-After')!);
								await new Promise(
									async (r) => setTimeout(() => r, (period + 0.1) * 1000)
								);
								continue;
							default:
								throw { status: 500, error: 'Unknown playlist add error' };
						};
					if (iterations <= hundreds) total += 100;
					else if (remain > 0) total += remain;
					iterations++;
				} catch (e: any) {
					rej({
						status: e.status || 500,
						error: (e.error && `Error adding to new playlist: ${e.error}`)
							|| 'Error adding to new playlist'
					});
				};
				break;
			};
		};

		clearTimeout(earlyTimeout);
		partial = false;
		res({
			partial,
			total
		})
	});
};

export {
	playlistGetter,
	outputAdder
};
