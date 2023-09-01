import PlaylistAdder from './playlistAdder';
import PlaylistDiffer from './playlistDiffer';
import { SpecificPlaylistProvider } from './contexts/SpecificPlaylistProvider';
import { UserPlaylistProvider } from './contexts/UserPlaylistProvider';

const SpotifyMain = () => {
	return (
		<>
			<UserPlaylistProvider>
				<SpecificPlaylistProvider>
					<PlaylistAdder />
					<PlaylistDiffer />
				</SpecificPlaylistProvider>
			</UserPlaylistProvider>
		</>
	)
}
export default SpotifyMain;
