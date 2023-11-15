import { MyUserAPIRouteResponse } from '@components/spotify/types';
import { createContext, useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';

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

function UserPlaylistProvider(props: { children: React.ReactNode }) {
	// This will only ever be added to
	const [playlists, setPlaylists] = useState<MyPlaylistObject[]>([]);
	const [first, setFirst] = useState(true);
	// Controls pagination, must be validated on back-end
	const [page, setPage] = useState<number | null>(0);
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);


	const getUserPlaylistsHandler = async () => {
		setLoading(true);
		try {
			// If either 50th page of results or no next, cancel
			if (page === null) throw { message: 'No more' };
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

	useEffect(() => {
		if (first === false) {
			sessionStorage.setItem('USER_PLAYLISTS', JSON.stringify(playlists));
			return;
		}
		const storageData = sessionStorage.getItem('USER_PLAYLISTS');
		if (storageData !== null) {
			const sessionPlaylists = JSON.parse(storageData) as MyPlaylistObject[];
			setPlaylists(sessionPlaylists);
		}
		setFirst(false);
	}, [playlists]);

	const clearUserPlaylistsHandler = () => {
		setPlaylists([]);
		setError(null);
		setPage(0);
		return null;
	}

	const updateUserPlaylistsHandler = (playlist: MyPlaylistObject) => {
		const set = new Set();
		if (playlists !== null) {
			for (const playlist of playlists) set.add(playlist.id);
			if (set.has(playlist.id) === false)
				setPlaylists([playlist, ...playlists]);
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
