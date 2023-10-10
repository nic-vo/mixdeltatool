import { useState } from 'react';
import PlaylistAdder from './playlistAdder';
import PlaylistDiffer from './playlistDiffer';

const SpotifyRouter = () => {
	const [nav, setNav] = useState('add');

	return (
		<section>
			<button onClick={() => setNav('add')}>Add</button>
			<button onClick={() => setNav('diff')}>Diff</button>
			{nav === 'add' && <PlaylistAdder />}
			{nav === 'diff' && <PlaylistDiffer />}
		</section>
	);
}

export default SpotifyRouter;
