import PlaylistAdder from './playlistAdder';
import PlaylistDiffer from './playlistDiffer';
import { SpecificPlaylistProvider } from './SpecificPlaylistProvider';
import { UserPlaylistProvider } from './UserPlaylistProvider';

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
