import { useContext } from 'react';
import { UserPlaylistContext } from '../../contexts/UserPlaylistProvider';

import styles from '../PlaylistAdder.module.scss';

export default function UserAdder(props: { children: React.ReactNode }) {
	// Basically dump most of the context here because it requires every bit
	const {
		userCurrentPage,
		userLoading,
		userError,
		getUserPlaylistsHandler,
		clearUserPlaylistsHandler
	} = useContext(UserPlaylistContext);

	return (
		<section>
			<h2 className={styles.heading}>Browse your playlists</h2>
			<section className={styles.innerContainer}>
				<button
					onClick={getUserPlaylistsHandler}
					disabled={userLoading || userCurrentPage === null}>
					Get your playlists</button>
				<button
					onClick={clearUserPlaylistsHandler}
					disabled={userLoading}>
					Clear your playlists</button>
				<p>Next page {userCurrentPage !== null ? userCurrentPage : 'end'}</p>
				<p>User {userLoading ? 'loading' : 'idle'}</p>
				<p>{userError !== null && userError}</p>
			</section>
			{props.children}
		</section >
	);
};
