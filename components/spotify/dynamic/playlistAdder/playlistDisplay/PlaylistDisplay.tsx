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
			return userPlaylists;
		}, [userPlaylists.length]);
	} else {
		memoized = useMemo(() => {
			return specificPlaylists;
		}, [specificPlaylists.length]);
	}

	return (
		<section className={styles.container}>
			<h2 className={styles.heading}>
				{user === true ? 'Your' : 'Specific'} Playlists
			</h2>
			<div className={styles.listContainer}>
				{memoized.length === 0 ?
					<p>Nothing yet</p>
					:
					(<ul className={styles.list}>
						{
							memoized.map((playlist) => {
								const { id, name, owner, tracks, image } = playlist;
								return (
									<li key={id} className={styles.item}>
										{
											image !== null &&
											image !== undefined &&
											<img
												src={image.url}
												alt={`${name}'s album art`}
												className={styles.image} />
										}
										<ul className={styles.info}>
											<li>Name: {name}</li>
											<li>Owner: {owner.display_name}</li>
											<li>Tracks: {tracks}</li>
										</ul>
									</li>
								);
							})}
					</ul>)
				}
			</div>
		</section>
	);
};
