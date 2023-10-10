import { useContext, memo, useMemo } from 'react';
import { UserPlaylistContext } from '../../contexts/UserPlaylistProvider';
import { SpecificPlaylistContext } from '../../contexts/SpecificPlaylistProvider';

import styles from './PlaylistDisplay.module.scss';

export default function PlaylistDisplay(props: { user: boolean }) {
	const { user } = props;
	const { userPlaylists } = useContext(UserPlaylistContext);
	const { specificPlaylists } = useContext(SpecificPlaylistContext);
	let memoized;
	if (user === true) {
		memoized = useMemo(() => {
			return (
				<section>
					<h2>{user ? 'Your' : 'Specific'} Playlists</h2>
					{userPlaylists !== null &&
						userPlaylists !== undefined &&
						<ul>
							{userPlaylists.map((playlist) => {
								return (
									<li key={playlist.id}>
										<p>{playlist.name}</p>
										<p>{playlist.owner.display_name}</p>
										<p>Tracks: {playlist.tracks}</p>
										{playlist.image !== null &&
											playlist.image !== undefined &&
											<img src={playlist.image.url} alt='' />}
									</li>
								);
							})}
						</ul>
					}
				</section>
			)
		}, [userPlaylists]);
	} else {
		memoized = useMemo(() => {
			return (
				<section>
					<h2>{user ? 'Your' : 'Specific'} Playlists</h2>
					{specificPlaylists !== null &&
						specificPlaylists !== undefined &&
						<ul>
							{specificPlaylists.map((playlist) => {
								return (
									<li key={playlist.id}>
										<p>{playlist.name}</p>
										<p>{playlist.owner.display_name}</p>
										<p>Tracks: {playlist.tracks}</p>
										{playlist.image !== null &&
											playlist.image !== undefined &&
											<img src={playlist.image.url} alt='' />}
									</li>
								);
							})}
						</ul>
					}
				</section>
			)
		}, [specificPlaylists]);
	};
	return memoized;
};
