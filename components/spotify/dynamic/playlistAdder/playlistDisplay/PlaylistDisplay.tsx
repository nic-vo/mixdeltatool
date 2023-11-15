import { useContext, useMemo } from 'react';
import { UserPlaylistContext } from '../../contexts/UserPlaylistProvider';
import { SpecificPlaylistContext } from '../../contexts/SpecificPlaylistProvider';
import { sanitize } from 'dompurify';

import look from './PlaylistDisplay.module.scss';

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
		<section className={look.container}>
			<h2 className={look.heading}>
				{user === true ? 'Your' : 'Specific'} Playlists
			</h2>
			<div className={look.listContainer}>
				{memoized.length === 0 ?
					<p>Nothing yet</p>
					:
					(<ul className={look.list}>
						{
							memoized.map((playlist) => {
								const { id, name, owner, tracks, image } = playlist;
								return (
									<li key={id} className={look.item}>
										{
											image !== null &&
											image !== undefined &&
											<img
												src={sanitize(image.url)}
												alt={`${sanitize(name)}'s album art`}
												className={look.image} />
										}
										<ul className={look.info}>
											<li>{name}</li>
											<li>Owner by {owner.display_name}</li>
											<li>{tracks} tracks</li>
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
