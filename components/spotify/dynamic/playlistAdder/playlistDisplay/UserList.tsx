import { useContext, useMemo } from 'react';
import { UserPlaylistContext } from '../../contexts/UserPlaylistProvider';

import local from './PlaylistDisplay.module.scss';
import { ListItem } from '@components/misc';

export default function UserList() {
	const { userPlaylists } = useContext(UserPlaylistContext);

	let memo = useMemo(() => userPlaylists, [userPlaylists.length]);

	if (memo.length === 0)
		return (
			<p style={{
				color: '#666',
				fontStyle: 'italic',
				textAlign: 'center',
				margin: 'auto'
			}}>nothing yet...</p>
		);

	return (
		<ul className={local.list}>
			{memo.map(playlist => (
				<li key={playlist.id} >
					<ListItem playlist={playlist} />
				</li>
			)
			)}
		</ul>
	);
}
