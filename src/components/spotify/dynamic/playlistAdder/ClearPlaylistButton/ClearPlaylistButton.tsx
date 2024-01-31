import { useContext } from 'react'
import { SpecificPlaylistContext } from '../../contexts/SpecificPlaylistProvider'
import { UserPlaylistContext } from '../../contexts/UserPlaylistProvider'
import { GlobalLoadingContext } from '../../contexts/GlobalLoadingProvider';
import { FaTimes } from 'react-icons/fa';

import local from './ClearPlaylistButton.module.scss';
import global from '@styles/globals.module.scss';

const ClearPlaylistButton = (props: { user: boolean }) => {
	const { clearSpecificPlaylistsHandler, specificLoading } = useContext(SpecificPlaylistContext);
	const { clearUserPlaylistsHandler, userLoading } = useContext(UserPlaylistContext);
	const { gLoading } = useContext(GlobalLoadingContext);

	let memoizedHandler = props.user ?
		clearUserPlaylistsHandler : clearSpecificPlaylistsHandler;

	const classer = global.emptyButton.concat(' ', local.button);

	return (
		<button
			disabled={gLoading || (props.user ? userLoading : specificLoading)}
			onClick={memoizedHandler}
			className={classer}>
			<FaTimes /> Clear Playlists</button>
	);
}

export default ClearPlaylistButton;
