import { MyUserAPIRouteResponse } from '@components/spotify/types';
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

import { MyPlaylistObject } from '../../types';

const UserContextInit = {
	userPlaylists: [] as MyPlaylistObject[],
	userCurrentPage: 0 as number | null,
	userError: null as null | string,
	userLoading: false,
	clearUserPlaylistsHandler: () => null,
	getUserPlaylistsHandler: async () => null,
	updateUserPlaylistsHandler: (playlist: MyPlaylistObject) => null
};

type UserContextSignature = typeof UserContextInit;

const UserPlaylistContext = createContext<UserContextSignature>(UserContextInit);

const SSKEYDATA = 'USER_PLAYLISTS';
const SSPKEYDATA = 'USER_PLAYLISTS_PAGE';

function UserPlaylistProvider(props: { children: React.ReactNode }) {
	// This will only ever be added to
	const [playlists, setPlaylists] = useState<MyPlaylistObject[]>([]);
	const [first, setFirst] = useState(true);
	// Controls pagination, must be validated on back-end
	const [page, setPage] = useState<number | null>(0);
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);

	const { gLoading, updateGLoading } = useContext(GlobalLoadingContext);

	const getUserPlaylistsHandler = async () => {
		if (gLoading) {
			setError(`Something's busy. Please wait...`);
			return null;
		}
		updateGLoading(true);
		setLoading(true);
		setError(null);
		try {
			// If either 50th page of results or no next, cancel
			if (page === null) throw { message: 'No more' };
			const raw = await fetch(`/api/spotify/getUser?page=${page}`);
			if (raw.status === 401) signin('spotify');
			if (raw.ok === false) {
				const jsoned = await raw.json();
				// TODO: define a standard error interface (?)
				throw { message: jsoned.message };
			}
			const jsoned = await raw.json() as MyUserAPIRouteResponse;
			// Disable fetching if no more pages, else page++
			setPage(prev => jsoned.next === null ? null : prev! + 1);
			// First request means empty state
			if (playlists === null) {
				setPlaylists(jsoned.playlists);
				return null;
			}
			// Else, compare attempt to add new playlists
			// Only add non-duplicate playlists
			const currentMap = new Map();
			const newMap = new Map();
			// Put current playlists in map
			for (const playlist of playlists)
				currentMap.set(playlist.id, playlist);
			// Put new playlists in their own map
			for (const playlist of jsoned.playlists)
				if (newMap.has(playlist.id) === false)
					newMap.set(playlist.id, playlist);
			// Compare the maps
			for (const key of newMap.keys())
				if (currentMap.has(key) === false)
					currentMap.set(key, newMap.get(key));
			// Set new playlist state from the ones that pass
			setPlaylists(Array.from(currentMap.values()));
		} catch (e: any) {
			setError(e.message || 'Unknown error');
		}
		setLoading(false);
		updateGLoading(false);
		return null;
	}

	useEffect(() => {
		// If not first load, set sessionStorage to new playlist object
		if (first === false) {
			sessionStorage.setItem(SSKEYDATA, JSON.stringify(playlists));
			sessionStorage.setItem(SSPKEYDATA, page === null ? 'null' : page.toString());
			return;
		}

		// If first load, set playlist to sessionStorage
		const storageData = sessionStorage.getItem(SSKEYDATA);
		const pageStorageData = sessionStorage.getItem(SSPKEYDATA);
		// If sessionStorage is empty, no big deal
		if (storageData === null || pageStorageData === null) {
			setFirst(false);
			return;
		};

		try {
			const sessionPage = pageStorageData === 'null' ? null
				: parseInt(pageStorageData) >= 50 ? null : parseInt(pageStorageData);
			const sessionPlaylists = JSON.parse(storageData) as MyPlaylistObject[];
			// Map over playlists to sanitize their name and image.url if defined
			const sanitizedPlaylists = sessionPlaylists.map(playlist => {
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
			setPage(sessionPage);
			setPlaylists(sanitizedPlaylists);
		} catch {
			// Silent catch in case of weird non-parseable JSON
		}
		setFirst(false);
	}, [playlists]);

	const clearUserPlaylistsHandler = useCallback(() => {
		setPlaylists(() => []);
		setError(() => null);
		setPage(0);
		return null;
	}, []);

	const updateUserPlaylistsHandler = (playlist: MyPlaylistObject) => {
		// Gets called after a successful diff, I think
		if (playlists === null) {
			setPlaylists([playlist]);
			return null;
		}
		const set = new Set();
		for (const playlist of playlists) set.add(playlist.id);
		if (set.has(playlist.id) === false)
			setPlaylists([playlist, ...playlists]);
		return null;
	}

	return (
		<UserPlaylistContext.Provider value={
			{
				userPlaylists: playlists,
				userCurrentPage: page,
				userLoading: loading || gLoading,
				userError: error,
				getUserPlaylistsHandler,
				updateUserPlaylistsHandler,
				clearUserPlaylistsHandler
			}
		}>
			{props.children}
		</UserPlaylistContext.Provider>
	);
}

export {
	UserPlaylistContext,
	UserPlaylistProvider
};
