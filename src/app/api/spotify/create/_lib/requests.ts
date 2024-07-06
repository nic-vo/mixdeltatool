import { SPOT_URL_BASE } from '@/consts/spotify';
import { threeRetries } from '@/lib/route_helpers/wrappers';
import { badResponse } from '@/lib/route_helpers/responses';
import {
	playlistObjectParser,
	userDetailsParser,
	MyPlaylistObject,
} from '@/lib/validators';
import { randomBytes } from 'crypto';
import fs from 'fs/promises';
import path from 'path';

import {
	SpotAlbumTracksResponse,
	SpotPlaylistTracksResponse,
	ActionType,
} from '@/types/spotify';

type descArgs = { du?: number; shared?: number; tu?: number };

export function SERVER_DIFF_TYPES(params: {
	target: {
		name: string;
		owner: string;
	};
	differ: {
		name: string;
		owner: string;
	};
	actionType: ActionType;
}) {
	const { target, differ, actionType } = params;
	switch (actionType) {
		case 'adu':
			return ({ du }: descArgs) =>
				`Added ${du ?? 'some'} tracks from ${differ.owner}'s "${
					differ.name
				}" to ` + `${target.owner} 's "${target.name}".`;

		case 'odu':
			return ({ du }: descArgs) =>
				`Replaced ${target.owner}'s "${target.name}" entirely with ` +
				`${du} tracks unique to ${differ.owner}'s "${differ.name}".`;

		case 'otu':
			return ({ shared }: descArgs) =>
				`${shared ?? 'Some'} tracks shared by ${target.owner}'s "${
					target.name
				}" and ` + `${differ.owner}'s "${differ.name}" were removed.`;

		case 'bu':
			return ({ du, tu }: descArgs) =>
				`Any similarities between ${target.owner}'s "${target.name}" ` +
				`and ${differ.owner}'s "${differ.name}" were removed; ` +
				`now contains ${tu ?? 'some'} tracks from the former ` +
				`and ${du ?? 'some'} tracks from the latter.`;

		case 'stu':
			return ({ shared }: descArgs) =>
				`${shared} tracks that exist in both ${target.owner}'s ` +
				`"${target.name}" and ${differ.owner}'s "${differ.name}" remain.`;
	}
}

function genUId(length: number) {
	const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
	const buffer = randomBytes(length * 2);
	let result = '';
	for (let i = 0; i < length; i++) {
		result += chars.charAt(buffer.readUInt8(i) % chars.length);
	}
	return result;
}

export async function getPlaylistTracks({
	id,
	type,
	accessToken,
}: {
	id: string;
	type: 'album' | 'playlist';
	accessToken: string;
}) {
	const base = SPOT_URL_BASE.concat(type, 's/', id, '/tracks?');
	const params = new URLSearchParams({ offset: '0', limit: '50' });
	if (type === 'playlist')
		params.append('fields', 'next,total,items(track(uri))');
	const headers = new Headers();
	headers.append('Authorization', `Bearer ${accessToken}`);
	let next: string | null = base.concat(params.toString());

	const set: Set<string> = new Set();
	let completed = 0;
	let total = 0;

	while (next !== null) {
		const nextURL = next; // This is necessary for TypeScript for some reason
		const newFetch = () => fetch(nextURL, { headers });
		const spotifyResponse = await threeRetries(newFetch, {
			403: `For some reason, you can't access one of those`,
			404: `One of those doesn't exist`,
		});
		if (!spotifyResponse.ok) return spotifyResponse;

		let data;
		if (type === 'playlist') {
			data = (await spotifyResponse.json()) as SpotPlaylistTracksResponse;
			for (const {
				is_local,
				track: { uri },
			} of data.items) {
				if (is_local || set.has(uri)) continue;
				set.add(uri);
				completed += 1;
			}
		} else {
			data = (await spotifyResponse.json()) as SpotAlbumTracksResponse;
			for (const { uri } of data.items) {
				if (!uri || set.has(uri)) continue;
				set.add(uri);
				completed += 1;
			}
		}
		total = data.total;
		next = data.next;
	}

	return Response.json(
		{ total, completed, items: Array.from(set) },
		{ status: 200 }
	);
}

async function getUserIDFromSpotify(accessToken: string) {
	const url = SPOT_URL_BASE.concat('me');
	const headers = new Headers();
	headers.append('Authorization', `Bearer ${accessToken}`);
	return await threeRetries(() => fetch(url, { headers }), {});
}

export async function createEmptyPlaylist({
	accessToken,
	newName,
	target,
}: {
	accessToken: string;
	newName: string | null;
	target: MyPlaylistObject | false;
}) {
	const userIDResponse = await getUserIDFromSpotify(accessToken);
	if (!userIDResponse.ok) return userIDResponse;
	let userID: string;
	try {
		const parsed = userDetailsParser.parse(await userIDResponse.json());
		userID = parsed.id;
	} catch {
		return badResponse(502, {
			message: `There as an error with Spotify's response`,
		});
	}
	const url = SPOT_URL_BASE.concat('users/', userID, '/playlists');
	const headers = new Headers();
	headers.append('Authorization', `Bearer ${accessToken}`);
	headers.append('Content-Type', 'application/json');
	const request = () =>
		fetch(url, {
			headers,
			method: 'POST',
			body: JSON.stringify({
				name: `MixDelta - ${newName ?? genUId(4)}`,
				public: false,
			}),
		});

	const createResponse = await threeRetries(request, {
		403: `For some reason, you're not allowed to create a playlist`,
	});
	if (!createResponse.ok) return createResponse;

	let returner: MyPlaylistObject;
	try {
		const parsed = playlistObjectParser.parse(await createResponse.json());
		returner = {
			...parsed,
			owner: [
				{
					...parsed.owner,
					name: parsed.owner.display_name || 'Spotify User',
				},
			],
			image: parsed.images ? parsed.images[0] : null,
			tracks: 0,
		};
	} catch {
		return badResponse(502, {
			message: 'Spotify could not create a new playlist for you',
		});
	}

	// Attempt to upload any thumbnail at all
	// Either the default or keeping the original playlist's
	// Fail silently cuz completely unnecessary
	let newIMGURL = '/mdl.jpg';
	try {
		const putURL = SPOT_URL_BASE.concat('playlist/', returner.id, '/images');
		const putHeaders = new Headers();
		putHeaders.append('Authorization', `Bearer ${accessToken}`);
		putHeaders.append('Content-Type', 'image/jpeg');
		let imgString;
		if (target === false || !target.image) {
			imgString = await fs.readFile(
				path.join(process.cwd(), 'public', 'mdl.jpg'),
				{ encoding: 'base64' }
			);
		} else {
			const imgFromSpot = await fetch(target.image.url); // Get the supplied playlist's image url
			imgString = Buffer.from(await imgFromSpot.arrayBuffer()).toString(
				'base64'
			);
			newIMGURL = target.image.url;
		}
		await threeRetries(
			() =>
				fetch(putURL, { headers: putHeaders, method: 'PUT', body: imgString }),
			{}
		); // Silent fetch
	} catch {}
	returner.image = { url: newIMGURL, height: null, width: null };

	return Response.json(returner, { status: 201 });
}

export async function populatePlaylistWithComparison({
	accessToken,
	id,
	items,
	globalTimeoutMS,
	description,
}: {
	accessToken: string;
	id: string;
	items: Set<string>;
	globalTimeoutMS: number;
	description: string;
}) {
	const uris = Array.from(items);
	const fetches: string[][] = [];
	const remain = uris.length & 100;
	const hundreds = Math.floor(uris.length / 100);
	for (let i = 0; i < hundreds; i++) {
		fetches.push(uris.slice(0 + 100 * i, 100 + 100 * i));
	}
	if (remain !== 0) fetches.push(uris.slice(0 - remain));
	const headers = new Headers();
	headers.append('Authorization', `Bearer ${accessToken}`);
	headers.append('Content-Type', 'application/json');
	const postURL = SPOT_URL_BASE.concat('playlists/', id, '/tracks');

	let iterations = 1;
	const total = uris.length;
	let completed = 0;

	for (const uriArr of fetches) {
		if (Date.now() + 500 > globalTimeoutMS) break;
		const spotPostResponse = await threeRetries(() =>
			fetch(postURL, {
				headers,
				method: 'POST',
				body: JSON.stringify({ uris: uriArr }),
			})
		);
		if (!spotPostResponse.ok) break;
		// Add new number to completed, either a hundred or the remainder
		if (iterations <= hundreds) completed += 100;
		else if (remain > 0) completed += remain;
		iterations += 1;
	}

	if (completed === 0) return badResponse(504);

	if (Date.now() + 500 > globalTimeoutMS)
		return Response.json({ completed, total }, { status: 201 });

	description = description.concat(
		` Contains ${completed}/${total} tracks from the comparison.`
	);

	const descURL = SPOT_URL_BASE.concat('playlists/', id);
	await threeRetries(() =>
		fetch(descURL, {
			headers,
			method: 'PUT',
			body: JSON.stringify({ description }),
		})
	);

	return Response.json({ completed, total }, { status: 201 });
}
