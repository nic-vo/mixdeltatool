import { useContext, useMemo } from 'react';
import { UserPlaylistContext } from '../../contexts/UserPlaylistProvider';
import { SpecificPlaylistContext } from '../../contexts/SpecificPlaylistProvider';

export default function PlaylistOptions() {
	const { userPlaylists } = useContext(UserPlaylistContext);
	const { specificPlaylists } = useContext(SpecificPlaylistContext);
	const memoized = useMemo(() => {
		return (
			<>
				<option value=''>Choose one</option>
				<optgroup label='Your Playlists'>
					{
						userPlaylists !== null &&
						userPlaylists.map((playlist) => {
							const { id, name, owner, tracks } = playlist;
							return (
								<option value={id} key={id}>
									{name} | {owner.display_name} | {tracks} tracks
								</option>
							)
						})
					}
				</optgroup>
				<optgroup label='Specific Playlists'>
					{
						specificPlaylists !== null &&
						specificPlaylists.map((playlist) => {
							const { id, name, owner, tracks } = playlist;
							return (
								<option value={id} key={id}>
									{name} | {owner.display_name} | {tracks} tracks
								</option>
							)
						})
					}
				</optgroup>
			</>
		)
	}, [userPlaylists, specificPlaylists]);
	return memoized;
};
