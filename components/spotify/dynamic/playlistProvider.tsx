import { MySpotifyAPIRouteResponse, MySpotifyPlaylistObject } from '@components/spotify/types';
import { createContext, useState, useEffect } from 'react';
import { myContext } from './types';
import { signIn } from 'next-auth/react';
import { LOCAL_CUSTOM_LISTS, LOCAL_END, LOCAL_EXPIRES, LOCAL_USER_LISTS } from '@consts/spotify';

const contextInit = {
	userPlaylists: null,
	customPlaylists: null,
	loading: false,
	error: null,
	nextPage: 0,
	getUserPlaylistsHandler: async () => null
};

type ProviderState = MySpotifyPlaylistObject[] | null;

const PlaylistContext = createContext<myContext>(contextInit);

function PlaylistProvider(props: { children: React.ReactNode }) {
	// This will only ever be added to
	const [userPlaylists, setUserPlaylists] = useState<ProviderState>(null);
	// This can be modified to remove unwanted playlists
	const [customPlaylists, setCustomPlaylists] = useState<ProviderState>(null);
	const [nextPage, setNextPage] = useState<number | null>(0);
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);

	const getUserPlaylistsHandler = async () => {
		// If either 20th nextPage of results or no next, cancel
		if (error !== null || nextPage === null) return null;
		// Start load
		setLoading(true);
		try {
			const raw = await fetch(`/api/spotify/getUserPlaylists?page=${nextPage}`);
			if (raw.status === 401) signIn();
			if (raw.ok === false) {
				const jsoned = await raw.json();
				throw jsoned.error;
			};
			const jsoned = await raw.json() as MySpotifyAPIRouteResponse;
			if (userPlaylists !== null) {
				const currentMap = new Map();
				const newMap = new Map();
				for (const playlist of userPlaylists) {
					currentMap.set(playlist.id, playlist);
				};
				for (const playlist of jsoned.playlists) {
					if (newMap.has(playlist.id) === false)
						newMap.set(playlist.id, playlist);
				};
				for (const key of newMap.keys()) {
					if (currentMap.has(key) === false)
						currentMap.set(key, newMap.get(key));
				};
				setUserPlaylists(Array.from(currentMap.values()));
			} else {
				setUserPlaylists(jsoned.playlists);
			};
			if (jsoned.next === null) setNextPage(null);
			else setNextPage(prev => prev! + 1);
			setLoading(false);
		} catch (e) {
			if (typeof (e) === 'string') setError(e);
			else setError('Unknown error');
			setLoading(false);
		};
		return null;
	};


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
	// 	if (localEnd !== null) setNextPage(null);
	// 	const localUserLists = localStorage.getItem(LOCAL_USER_LISTS)
	// 	if (localUserLists !== null) {
	// 		const loadedUserPlaylists = JSON.parse
	// 	}
	// }, []);



	const getCustomPlaylistHandler = async () => {

	}

	return (
		<PlaylistContext.Provider value={{
			userPlaylists,
			customPlaylists,
			loading,
			getUserPlaylistsHandler,
			error,
			nextPage
		}}>
			{props.children}
		</PlaylistContext.Provider>
	)
}

export {
	PlaylistContext,
	PlaylistProvider
}
