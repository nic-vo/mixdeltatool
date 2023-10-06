import { MyUserAPIRouteResponse } from '@components/spotify/types';
import { createContext, useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';

import type {
	UserContextSignature,
	ProviderState,
	MyPlaylistObject
} from '../../types';

const contextInit = {
	userPlaylists: null,
	userCurrentPage: 0,
	userError: null,
	userLoading: false,
	clearUserPlaylistsHandler: () => null,
	getUserPlaylistsHandler: async () => null,
	updateUserPlaylistsHandler: () => null
};

const UserPlaylistContext = createContext<UserContextSignature>(contextInit);

function UserPlaylistProvider(props: { children: React.ReactNode }) {
	// This will only ever be added to
	const [playlists, setPlaylists] = useState<ProviderState>(null);
	// Controls pagination, must be validated on back-end
	const [page, setPage] = useState<number | null>(0);
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);


	const getUserPlaylistsHandler = async () => {
		setLoading(true);
		try {
			// If either 50th page of results or no next, cancel
			if (page === null) throw 'No more';
			const raw = await fetch(`/api/spotify/getUserPlaylists?page=${page}`);
			if (raw.status === 401) signIn();
			if (raw.ok === false) {
				const jsoned = await raw.json();
				// TODO: define a standard error interface (?)
				throw { message: jsoned.message };
			}
			const jsoned = await raw.json() as MyUserAPIRouteResponse;
			if (playlists === null) {
				setPlaylists(jsoned.playlists);
			} else {
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
			}
			// Disable fetching if no more pages
			if (jsoned.next === null) setPage(null);
			else setPage(prev => prev! + 1);
		} catch (e: any) {
			setError(e.message || 'Unknown error');
		}
		setLoading(false);
		return null;
	}


	// useEffect(() => {
	// 	if (process.env.NEXT_PUBLIC_STORAGE_SALT === undefined) return () => { };
	// 	const localExpires = localStorage.getItem(LOCAL_EXPIRES);
	// 	if (localExpires === null || parseInt(localExpires) < Date.now()) {
	// 		localStorage.setItem(LOCAL_EXPIRES, Date.now().toString());
	// 		localStorage.setItem(LOCAL_END, '');
	// 		localStorage.setItem(LOCAL_USER_LISTS, '');
	// 		localStorage.setItem(LOCAL_CUSTOM_LISTS, '');
	// 		return () => { }
	// 	}
	// 	const localEnd = localStorage.getItem(LOCAL_END)
	// 	if (localEnd !== null) setPage(null);
	// 	const localUserLists = localStorage.getItem(LOCAL_USER_LISTS)
	// 	if (localUserLists !== null) {
	// 		const loadedUserPlaylists = JSON.parse
	// 	}
	// }, []);

	const clearUserPlaylistsHandler = () => {
		setPlaylists(null);
		setError(null);
		setPage(0);
		return null;
	}

	const updateUserPlaylistsHandler = (playlist: MyPlaylistObject) => {
		const set = new Set();
		if (playlists !== null) {
			for (const playlist of playlists) set.add(playlist.id);
			if (set.has(playlist.id) === false) {
				setPlaylists([playlist, ...playlists])
			}
		}
		return null;
	}

	return (
		<UserPlaylistContext.Provider value={
			{
				userPlaylists: playlists,
				userCurrentPage: page,
				userLoading: loading,
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
