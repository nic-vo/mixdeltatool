import { MyPlaylistObject } from '@components/spotify/types';

import styles from './PlaylistSingleDisplay.module.scss';

export default function PlaylistSingle(props: { playlist: MyPlaylistObject }) {
	const { name, owner, tracks, image } = props.playlist
	return (
		<div>
			<p>{name}</p>
			<p>{owner.display_name}</p>
			<p>Tracks: {tracks}</p>
			{image !== null &&
				image !== undefined &&
				<img src={image.url} alt='' />}
		</div>
	);
};
