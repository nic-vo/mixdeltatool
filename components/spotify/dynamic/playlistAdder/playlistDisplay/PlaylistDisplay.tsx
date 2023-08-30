import { useContext } from 'react';
import { PlaylistContext } from '../../playlistProvider';

import styles from './PlaylistDisplay.module.scss';

const PlaylistDisplay = (props: { user: boolean }) => {
	const { user } = props;
	console.log(`Rendering user: ${props.user}`);
	let data;
	if (props.user === true) {
		data = useContext(PlaylistContext).userPlaylists;
	} else {
		data = useContext(PlaylistContext).specificPlaylists;
	};
	return (
		<section>
			<h2>{user ? 'Your' : 'Specific'} Playlists</h2>
			{data !== null &&
				data !== undefined &&
				<ul>
					{data.map((playlist) => {
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
	);
};
export default PlaylistDisplay;
