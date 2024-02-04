import { useSelector, useDispatch } from 'react-redux';
import { selectPage, selectUserFetch } from '@state/state';
import { retrieveUserListsAsync } from '@state/thunks';

import { SmallStatus } from '@components/misc';
import { FaDownload } from 'react-icons/fa';

import local from './UserAdder.module.scss';
import global from '@styles/globals.module.scss';

export default function UserAdder() {
	const userCurrentPage = useSelector(selectPage);
	const { loading: userLoading, error: userError } = useSelector(selectUserFetch);
	const dispatch = useDispatch();
	const getUserPlaylistsHandler = () =>
		dispatch(retrieveUserListsAsync(userCurrentPage));

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
		</>
	);
};
