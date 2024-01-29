import {
	createContext,
	useState,
	useEffect,
	useContext,
	useCallback
} from 'react';
import { signIn } from 'next-auth/react';
import { sanitize } from 'isomorphic-dompurify';
import { GlobalLoadingContext } from './GlobalLoadingProvider';

import type { MyPlaylistObject } from '../../types';

const SpecificContextInit = {
	specificPlaylists: [] as MyPlaylistObject[],
	specificLoading: false,
	specificError: null as null | string,
	getSpecificPlaylistHandler: async (params: {
		type: string, id: string
	}) => null,
	clearSpecificPlaylistsHandler: () => null
};

type SpecificContextSignature = typeof SpecificContextInit;

const SpecificPlaylistContext = createContext<SpecificContextSignature>(SpecificContextInit);

const SSKEYDATA = 'SPEC_PLAYLISTS';

function SpecificPlaylistProvider(props: { children: React.ReactNode }) {
	// TODO: This can be modified to remove unwanted playlists
	const [playlists, setPlaylists] = useState<MyPlaylistObject[]>([]);
	// Statuses
	const [first, setFirst] = useState(true);
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);

	const { gLoading, updateGLoading } = useContext(GlobalLoadingContext);

	useEffect(() => {
		// If not first load, set sessionStorage to new playlist object
		if (first === false) {
			sessionStorage.setItem(SSKEYDATA, JSON.stringify(playlists));
			return;
		}

		// If first load, set playlist to sessionStorage
		const storageData = sessionStorage.getItem(SSKEYDATA);
		// If sessionStorage is empty, no big deal
		if (storageData === null) {
			setFirst(false);
			return;
		};

		try {
			const sessionPlaylists = JSON.parse(storageData) as MyPlaylistObject[];
			// Map over playlists to sanitize their name and image.url if defined
			const sanitizedPlaylists = sessionPlaylists.map(
				playlist => {
					if (playlist.image === undefined) {
						return {
							...playlist,
							name: sanitize(playlist.name),
							id: sanitize(playlist.id)
						};
					}
					return {
						...playlist,
						name: sanitize(playlist.name),
						id: sanitize(playlist.id),
						image: {
							...playlist.image,
							url: sanitize(playlist.image.url)
						}
					};
				});
			setPlaylists(sanitizedPlaylists);
		} catch {
			// In case of weird non-parseable JSON
		}
		setFirst(false);
	}, [playlists]);

	const clearSpecificPlaylistsHandler = useCallback(() => {
		setPlaylists(() => []);
		setError(() => null);
		return null;
	}, []);

	// For use with input element
	const getSpecificPlaylistHandler = async (
		params: {
			type: string, id: string
		}) => {
		if (gLoading) {
			setError(`Something's busy. Please wait...`);
			return null;
		}
		setError(null);
		setLoading(true);
		updateGLoading(true);
		try {
			const { id, type } = params;
			if (type !== 'album' && type !== 'playlist')
				throw { message: 'There is an error with this album / playlist link.' };

			const raw = await fetch(`/api/spotify/getSpecific?id=${id}&type=${type}`);
			if (raw.status === 401) signin('spotify');
			if (raw.ok === false) {
				const jsoned = await raw.json();
				throw { message: jsoned.message };
			}
			const jsoned = await raw.json() as MyPlaylistObject;
			if (playlists === null) setPlaylists([jsoned]);
			else {
				// Check to see if existing playlists contain new one
				const currentMap = new Map();
				// Put current playlists into map
				for (const playlist of playlists)
					currentMap.set(playlist.id, playlist);
				// Check if map has new playlist's id
				if (currentMap.has(jsoned.id) === true)
					throw { message: 'You have this playlist' };
				else currentMap.set(jsoned.id, jsoned);
				setPlaylists(Array.from(currentMap.values()));
			}
		} catch (e: any) {
			setError(e.message || 'Unknown error');
		}
		setLoading(false);
		updateGLoading(false);
		return null;
	}

	return (
		<SpecificPlaylistContext.Provider value={
			{
				specificPlaylists: playlists,
				specificLoading: loading || gLoading,
				specificError: error,
				getSpecificPlaylistHandler,
				clearSpecificPlaylistsHandler
			}}>
			{props.children}
		</SpecificPlaylistContext.Provider>
	);
}

export {
	SpecificPlaylistContext,
	SpecificPlaylistProvider
};
