import { useContext, useMemo } from 'react';
import { SpecificPlaylistContext } from '../../contexts/SpecificPlaylistProvider';

import local from './PlaylistDisplay.module.scss';
import { ListItem } from '@components/misc';

export default function SpecificList() {
	const { specificPlaylists } = useContext(SpecificPlaylistContext);

	let memo = useMemo(() => specificPlaylists, [specificPlaylists.length])

	console.log('specific render');

	if (memo.length === 0)
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
			{memo.map(playlist => <ListItem key={playlist.id} playlist={playlist} />)}
		</ul>
	);
}
