import { useDispatch, useSelector } from 'react-redux';
import {
	AppDispatch,
	selectSpecificFetch,
	selectUserFetch,
} from '@/state/state';
import { clearUser } from '@/state/userPlaylistsSlice';
import { clearSpecific } from '@/state/specificPlaylistsSlice';
import { FaTimes } from 'react-icons/fa';

import local from './ClearPlaylistButton.module.scss';
import global from '@/styles/globals.module.scss';

const ClearPlaylistButton = (props: { user: boolean }) => {
	const dispatch = useDispatch<AppDispatch>();

	const { loading: userLoading } = useSelector(selectUserFetch);
	const { loading: specificLoading } = useSelector(selectSpecificFetch);

	let memoizedHandler = () => {
		props.user ? dispatch(clearUser()) : dispatch(clearSpecific());
	};

	const classer = global.emptyButton.concat(' ', local.button);

	return (
		<button
			disabled={props.user ? userLoading : specificLoading}
			onClick={memoizedHandler}
			className={classer}>
			<FaTimes /> Clear Playlists
		</button>
	);
};

export default ClearPlaylistButton;
