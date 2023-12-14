import { useContext } from 'react';
import { UserPlaylistContext } from '../../contexts/UserPlaylistProvider';

import local from '../PlaylistAdder.module.scss';
import global from '@styles/globals.module.scss';

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
		<>
			<section className={local.innerContainer}>
				<button
					onClick={getUserPlaylistsHandler}
					disabled={userLoading || userCurrentPage === null}
					className={global.emptyButton}>
					{userCurrentPage === null ?
						'No more playlists available' : 'Get more playlists'}
				</button>
				<button
					onClick={clearUserPlaylistsHandler}
					disabled={userLoading}
					className={global.emptyButton}>
					Clear your playlists</button>
				<p>Next page {userCurrentPage !== null ? userCurrentPage : 'end'}</p>
				<p>User {userLoading ? 'loading' : 'idle'}</p>
				<p>{userError !== null && userError}</p>
			</section>
			{props.children}
		</ >
	);
};
