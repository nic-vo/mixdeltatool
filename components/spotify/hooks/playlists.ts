import type { MySpotifyPlaylistResponse } from '@lib/types/spotify';

import { useState } from 'react'

export default function usePlaylists() {
	const [playlists, setPlaylists] = useState<null | MySpotifyPlaylistResponse[]>(null);
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<null | string>(null);

	const getPlaylistsHandler = async () => {
		setLoading(true);
		try {
			const raw = await fetch('/api/spotify/getPlaylists');
			if (raw.ok === false) {
				const jsoned = await raw.json();
				throw jsoned.error;
			};
			const jsoned = await raw.json() as MySpotifyPlaylistResponse[];
			setPlaylists(jsoned);
			setLoading(false);
		} catch (e) {
			if (typeof (e) === 'string') setError(e);
			else setError('Unknown error');
			setLoading(false);
			return null;
		};
	};
	return { playlists, loading, error, getPlaylistsHandler }
}
