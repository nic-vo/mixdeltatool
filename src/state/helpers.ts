import { myPlaylistObjectParser } from '@/lib/spotify/validators';
import { sanitize } from 'isomorphic-dompurify';

import { MyPlaylistObject } from '@/components/spotify/types';

export const sanitizePlaylists = (playlists: MyPlaylistObject[]) => {
	try {
		const parsed = playlists.map((playlist) =>
			myPlaylistObjectParser.parse(playlist)
		);
		const sanitized = parsed.map((playlist) => {
			return {
				...playlist,
				name: sanitize(playlist.name, {
					ALLOWED_TAGS: [],
				}),
				id: sanitize(playlist.id, {
					ALLOWED_TAGS: [],
				}),
				image: !playlist.image
					? undefined
					: {
							...playlist.image,
							url: sanitize(playlist.image.url, {
								ALLOWED_TAGS: [],
							}),
					  },
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

export const persistPage = (page: number | null, key: string) => {
	sessionStorage.setItem(key, page === null ? 'null' : page.toString());
};

/*
	Unknown action snippet:

		if (
			typeof (action) !== 'object'
		|| action === null
		|| 'type' in action === false) return next(action);
*/
