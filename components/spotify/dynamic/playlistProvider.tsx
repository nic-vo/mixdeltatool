import { MyUserAPIRouteResponse, MyPlaylistObject } from '@components/spotify/types';
import { createContext, useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { LOCAL_CUSTOM_LISTS, LOCAL_END, LOCAL_EXPIRES, LOCAL_USER_LISTS } from '@consts/spotify';

import type { PlaylistSignature, ProviderState } from './types';

const contextInit = {
	userPlaylists: null,
	specificPlaylists: null,
	userLoading: false,
	specificLoading: false,
	userError: null,
	specificError: null,
	userCurrentPage: 0,
	clearUserPlaylistsHandler: () => null,
	getUserPlaylistsHandler: async () => null,
	getSpecificPlaylistHandler: async () => null,
	clearSpecificPlaylistsHandler: () => null,
	updateUserPlaylistsHandler: () => null
};

const PlaylistContext = createContext<PlaylistSignature>(contextInit);

function PlaylistProvider(props: { children: React.ReactNode }) {
	// This will only ever be added to
	const [userPlaylists, setUserPlaylists] = useState<ProviderState>(null);
	// This can be modified to remove unwanted playlists
	const [specificPlaylists, setSpecificPlaylists] = useState<ProviderState>(null);
	const [userCurrentPage, setUserCurrentPage] = useState<number | null>(0);
	const [userLoading, setUserLoading] = useState<boolean>(false);
	const [specificLoading, setSpecificLoading] = useState<boolean>(false);
	const [userError, setUserError] = useState<string | null>(null);
	const [specificError, setSpecificError] = useState<string | null>(null);

	const getUserPlaylistsHandler = async () => {
		// If either 50th userCurrentPage of results or no next, cancel
		if (userCurrentPage === null
			|| userLoading === true) return null;
		// Start load
		setUserLoading(true);
		setUserError(null);
		try {
			const raw = await fetch(`/api/spotify/getUserPlaylists?page=${userCurrentPage}`);
			if (raw.status === 401) signIn();
			if (raw.ok === false) {
				const jsoned = await raw.json();
				throw jsoned.userError;
			};
			const jsoned = await raw.json() as MyUserAPIRouteResponse;
			if (userPlaylists === null) {
				setUserPlaylists(jsoned.playlists);
			} else {
				const currentMap = new Map();
				const newMap = new Map();
				for (const playlist of userPlaylists)
					currentMap.set(playlist.id, playlist);

				for (const playlist of jsoned.playlists)
					if (newMap.has(playlist.id) === false)
						newMap.set(playlist.id, playlist);

				for (const key of newMap.keys())
					if (currentMap.has(key) === false)
						currentMap.set(key, newMap.get(key));

				setUserPlaylists(Array.from(currentMap.values()));
			};
			if (jsoned.next === null) setUserCurrentPage(null);
			else setUserCurrentPage(prev => prev! + 1);
			setUserLoading(false);
		} catch (e: any) {
			if (typeof (e) === 'string') setUserError(e);
			else setUserError('Unknown userError');
			setUserLoading(false);
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
	// 	if (localEnd !== null) setUserCurrentPage(null);
	// 	const localUserLists = localStorage.getItem(LOCAL_USER_LISTS)
	// 	if (localUserLists !== null) {
	// 		const loadedUserPlaylists = JSON.parse
	// 	}
	// }, []);

	const clearUserPlaylistsHandler = () => {
		setUserPlaylists(null);
		setUserLoading(false);
		setUserError(null);
		setUserCurrentPage(0);
		return null;
	};

	const clearSpecificPlaylistsHandler = () => {
		setSpecificPlaylists(null);
		setSpecificLoading(false);
		setSpecificError(null);
		return null;
	};

	// For use with input element
	const getSpecificPlaylistHandler = async (params: {
		type: string, id: string
	}
	) => {
		if (specificLoading === true) return null;
		setSpecificLoading(true);
		const { id, type } = params;
		try {
			const raw = await fetch(`/api/spotify/getSpecificPlaylist?id=${id}&type=${type}`)
			if (raw.status === 401) signIn();
			if (raw.ok === false) {
				const jsoned = await raw.json();
				throw jsoned.error;
			};
			const jsoned = await raw.json() as MyPlaylistObject;
			if (specificPlaylists === null) {
				setSpecificPlaylists([jsoned]);
			} else {
				const currentMap = new Map();
				for (const playlist of specificPlaylists)
					currentMap.set(playlist.id, playlist);
				if (currentMap.has(jsoned.id) === true) throw 'You have this playlist';
				else currentMap.set(jsoned.id, jsoned);
				setSpecificPlaylists(Array.from(currentMap.values()));
			};
			setSpecificLoading(false);
		} catch (e: any) {
			if (typeof (e) === 'string') setSpecificError(e);
			else setSpecificError('Unknown specificError');
			setSpecificLoading(false);
		};
		return null;
	};

	return (
		<PlaylistContext.Provider value={{
			userPlaylists,
			specificPlaylists,
			userLoading,
			specificLoading,
			getUserPlaylistsHandler,
			clearUserPlaylistsHandler,
			getSpecificPlaylistHandler,
			clearSpecificPlaylistsHandler,
			userError,
			specificError,
			userCurrentPage
		}}>
			{props.children}
		</PlaylistContext.Provider>
	)
}

export {
	PlaylistContext,
	PlaylistProvider
}
