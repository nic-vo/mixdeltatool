import { DifferProvider } from './contexts/DifferProvider';
import { GlobalLoadingProvider } from './contexts/GlobalLoadingProvider';
import { SpecificPlaylistProvider } from './contexts/SpecificPlaylistProvider';
import { UserPlaylistProvider } from './contexts/UserPlaylistProvider';
import SpotifyRouter from './SpotifyRouter';

const SpotifyMain = () => {
	return (
		<GlobalLoadingProvider>
			<UserPlaylistProvider>
				<SpecificPlaylistProvider>
					<DifferProvider>
						<SpotifyRouter />
					</DifferProvider>
				</SpecificPlaylistProvider>
			</UserPlaylistProvider>
		</GlobalLoadingProvider>
	);
}

export default SpotifyMain;
