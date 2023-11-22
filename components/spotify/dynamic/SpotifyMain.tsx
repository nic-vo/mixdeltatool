import { SpecificPlaylistProvider } from './contexts/SpecificPlaylistProvider';
import { UserPlaylistProvider } from './contexts/UserPlaylistProvider';
import SpotifyRouter from './SpotifyRouter';

const SpotifyMain = () => {
	return (
		<main style={{
			display: 'flex',
			alignItems: 'center',
			flexDirection: 'column',
			width: '100svw'
		}}>
			<UserPlaylistProvider>
				<SpecificPlaylistProvider>
					<SpotifyRouter />
				</SpecificPlaylistProvider>
			</UserPlaylistProvider>
		</main>
	);
}

export default SpotifyMain;
