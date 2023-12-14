import AuthProvider from '@components/auth/provider';
import { SpotifyEntry } from '@components/spotify';

export default function Spotify() {
	return (
		<AuthProvider>
			<SpotifyEntry />
		</AuthProvider>
	);
}
