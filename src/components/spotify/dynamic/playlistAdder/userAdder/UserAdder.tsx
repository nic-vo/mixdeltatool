import { useContext } from 'react';
import { UserPlaylistContext } from '../../contexts/UserPlaylistProvider';
import { SmallStatus } from '@components/misc';
import { FaDownload } from 'react-icons/fa';

import local from './UserAdder.module.scss';
import global from '@styles/globals.module.scss';

export default function UserAdder() {
	// Basically dump most of the context here because it requires every bit
	const {
		userCurrentPage,
		userLoading,
		userError,
		getUserPlaylistsHandler
	} = useContext(UserPlaylistContext);

	const buttonClasser = `${global.emptyButton} ${local.button}${userCurrentPage === null ?
		` ${local.done}` : ''}`

	return (
		<>
			<button
				onClick={getUserPlaylistsHandler}
				disabled={userLoading || userCurrentPage === null}
				className={buttonClasser}>
				<FaDownload /> {userCurrentPage === null ? 'No more!' : 'Retrieve'}
			</button>
			<SmallStatus error={userError} loading={userLoading} />
		</ >
	);
};
