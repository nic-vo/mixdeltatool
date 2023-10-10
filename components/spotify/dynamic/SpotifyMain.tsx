import { SpecificPlaylistProvider } from './contexts/SpecificPlaylistProvider';
import { UserPlaylistProvider } from './contexts/UserPlaylistProvider';
import SpotifyRouter from './SpotifyRouter';

const SpotifyMain = () => {

	return (
		<>
			<UserPlaylistProvider>
				<SpecificPlaylistProvider>
					<SpotifyRouter />
				</SpecificPlaylistProvider>
			</UserPlaylistProvider>
		</>
	)
}
export default SpotifyMain;
