import { ListItem } from '@/components/misc';
import { useSelector } from 'react-redux';
import { selectUserPlaylists } from '@/state/state';

import local from './PlaylistDisplay.module.scss';

export default function UserList() {
	const userPlaylists = useSelector(selectUserPlaylists);

	if (userPlaylists.length === 0)
		return (
			<p
				style={{
					color: '#666',
					fontStyle: 'italic',
					textAlign: 'center',
					margin: 'auto',
				}}>
				nothing yet...
			</p>
		);

	return (
		<ul className={local.list}>
			{userPlaylists.map((playlist) => (
				<li key={playlist.id}>
					<ListItem playlist={playlist} />
				</li>
			))}
		</ul>
	);
}
