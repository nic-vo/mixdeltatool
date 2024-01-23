import { useContext, useMemo } from 'react';
import { UserPlaylistContext } from '../../contexts/UserPlaylistProvider';
import { SpecificPlaylistContext } from '../../contexts/SpecificPlaylistProvider';

export default function PlaylistOptions() {
	const { userPlaylists } = useContext(UserPlaylistContext);
	const { specificPlaylists } = useContext(SpecificPlaylistContext);
	const memoized = useMemo(() => {
		return (
			<>
				<option value=''>Choose one...</option>
				{
					specificPlaylists.length > 0 &&
					<optgroup label='Specific Playlists'>
						{specificPlaylists.map((playlist) => {
							const { id, name, owner, tracks } = playlist;
							return (
								<option value={id} key={id}>
									{name} / {owner.map((user, index) => `${user.name}${index < owner.length - 1 ? ',' : ''}`)} / {tracks} tracks
								</option>
							)
						})}
					</optgroup>
				}
				{
					userPlaylists.length > 0 &&
					<optgroup label='Your Playlists'>
						{
							userPlaylists.map((playlist) => {
								const { id, name, owner, tracks } = playlist;
								return (
									<option value={id} key={id}>
										{name} / {owner.map((user, index) => `${user.name}${index < owner.length - 1 ? ',' : ''}`)} / {tracks} tracks
									</option>
								)
							})}
					</optgroup>
				}
			</>
		)
	}, [userPlaylists, specificPlaylists]);
	return memoized;
};
