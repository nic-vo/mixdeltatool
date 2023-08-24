import { MySpotifyAPIRouteResponse, MySpotifyPlaylistObject } from '@components/spotify/types';
import { createContext, useState } from 'react';
import { myContext } from './types';

const contextInit = {
	playlists: null,
	loading: false,
	error: null,
	getPlaylistsHandler: async () => null
}

const PlaylistContext = createContext<myContext>(contextInit);

function PlaylistProvider(props: { children: React.ReactNode }) {
	const [playlists, setPlaylists] = useState<MySpotifyPlaylistObject[] | null>(null);

	const [more, setMore] = useState(true);
	const [link, setLink] = useState<string | null>('https://api.spotify.com/v1/me/playlists');
	const [page, setPage] = useState<number>(0);
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);

	const getPlaylistsHandler = async () => {
		setLoading(true);
		try {
			const raw = await fetch('/api/spotify/getPlaylists');
			if (raw.ok === false) {
				const jsoned = await raw.json();
				throw jsoned.error;
			};
			const jsoned = await raw.json() as MySpotifyAPIRouteResponse;
			console.log(jsoned);
			setPlaylists(jsoned.playlists);
			setLoading(false);
		} catch (e) {
			if (typeof (e) === 'string') setError(e);
			else setError('Unknown error');
			setLoading(false);
		};
		return null;
	};

	return (
		<PlaylistContext.Provider value={{ playlists, loading, getPlaylistsHandler, error }}>
			{props.children}
		</PlaylistContext.Provider>
	)
}

export {
	PlaylistContext,
	PlaylistProvider
}
