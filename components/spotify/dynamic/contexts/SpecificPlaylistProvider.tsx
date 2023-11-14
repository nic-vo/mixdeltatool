import { MyPlaylistObject } from '../../types';
import { createContext, useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';

import type { SpecificContextSignature, ProviderState } from '../../types';

const contextInit = {
	specificPlaylists: null,
	specificLoading: false,
	specificError: null,
	getSpecificPlaylistHandler: async () => null,
	clearSpecificPlaylistsHandler: () => null,
};

const SpecificPlaylistContext = createContext<SpecificContextSignature>(contextInit);

function SpecificPlaylistProvider(props: { children: React.ReactNode }) {
	// TODO: This can be modified to remove unwanted playlists
	const [playlists, setPlaylists] = useState<ProviderState>(null);
	// Statuses
	const [first, setFirst] = useState(true);
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (first === false) {
			sessionStorage.setItem('SPEC_PLAYLISTS', JSON.stringify(playlists));
			return;
		}
		const storageData = sessionStorage.getItem('SPEC_PLAYLISTS');
		if (storageData !== null) {
			const sessionPlaylists = JSON.parse(storageData) as ProviderState;
			setPlaylists(sessionPlaylists);
		}
		setFirst(false);
	}, [playlists]);

	const clearSpecificPlaylistsHandler = () => {
		setPlaylists(null);
		setError(null);
		return null;
	}

	// For use with input element
	const getSpecificPlaylistHandler = async (
		params: {
			type: string, id: string
		}) => {
		setError(null);
		setLoading(true);
		try {
			const { id, type } = params;
			if (type !== 'album' && type !== 'playlist')
				throw { message: 'There is an error with this album / playlist link.' };

			const raw = await fetch(`/api/spotify/getSpecificPlaylist?id=${id}&type=${type}`);
			if (raw.status === 401) signIn();
			if (raw.ok === false) {
				const jsoned = await raw.json();
				throw { message: jsoned.message };
			}
			const jsoned = await raw.json() as MyPlaylistObject;
			if (playlists === null) {
				setPlaylists([jsoned]);
			} else {
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
		return null;
	}

	return (
		<SpecificPlaylistContext.Provider value={
			{
				specificPlaylists: playlists,
				specificLoading: loading,
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
