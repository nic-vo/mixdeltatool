'use client';

import { myPlaylistObjectParser } from '@/lib/validators';
import { sanitize } from 'isomorphic-dompurify';

import type { MyPlaylistObject } from '@/lib/validators';

const stripper = (input: string) => sanitize(input, { ALLOWED_TAGS: [] });

export const sanitizePlaylists = (playlists: MyPlaylistObject[]) => {
	try {
		const parsed = playlists.map((playlist) =>
			myPlaylistObjectParser.parse(playlist)
		);
		const sanitized = parsed.map((playlist) => {
			return {
				...playlist,
				owner: playlist.owner.map((deets) => {
					return {
						id: stripper(deets.id),
						name: deets.name !== null ? stripper(deets.name) : null,
					};
				}),
				name: stripper(playlist.name),
				id: stripper(playlist.id),
				image: playlist.image
					? {
							...playlist.image,
							url: stripper(playlist.image.url),
					  }
					: null,
			};
		});
		return sanitized;
	} catch {
		return [];
	}
};

export const initPlaylists = (key: string): MyPlaylistObject[] => {
	const storageData = sessionStorage.getItem(key);
	if (storageData === null) return [];

	try {
		const parsed = JSON.parse(storageData) as MyPlaylistObject[];
		const sanitized = sanitizePlaylists(parsed);
		return sanitized;
	} catch {}
	return [];
};

export const initPage = (key: string): number | null => {
	const storage = sessionStorage.getItem(key);
	if (storage === null) return 0;
	if (storage === 'null') return null;
	try {
		const parsed = parseInt(storage);
		return parsed >= 0 && parsed < 50 ? parsed : 0;
	} catch {
		return 0;
	}
};

export const persistPlaylists = (
	key: string,
	playlists: MyPlaylistObject[]
) => {
	sessionStorage.setItem(key, JSON.stringify(playlists));
};

export const persistPage = (key: string, page: number | null) => {
	sessionStorage.setItem(key, page === null ? 'null' : page.toString());
};

/*
	Unknown action snippet:

		if (
			typeof (action) !== 'object'
		|| action === null
		|| 'type' in action === false) return next(action);
*/
