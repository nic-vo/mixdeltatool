import { ListItem } from '@components/misc';
import { useSelector } from 'react-redux';
import { selectSpecificPlaylists } from '@state/state';

import local from './PlaylistDisplay.module.scss';

export default function SpecificList() {
	const specificPlaylists = useSelector(selectSpecificPlaylists);

	if (specificPlaylists.length === 0)
		return (
			<p style={{
				color: '#666',
				fontStyle: 'italic',
				textAlign: 'center',
				margin: 'auto',
				alignSelf: 'center',
			}}>nothing yet...</p>
		);

	return (
		<ul className={local.list}>
			{specificPlaylists.map(playlist => (
				<li key={playlist.id} >
					<ListItem playlist={playlist} />
				</li>
			))}
		</ul>
	);
}
