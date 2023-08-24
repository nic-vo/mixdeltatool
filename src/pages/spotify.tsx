import AuthProvider from '@components/auth/provider';
import { PlaylistProvider } from '@components/spotify/dynamic';
import { SpotifyEntry } from '@components/spotify';

export default function Spotify() {
	return (
		<AuthProvider>
			<PlaylistProvider>
				{<SpotifyEntry />}
			</PlaylistProvider>
		</AuthProvider>
	)
}
