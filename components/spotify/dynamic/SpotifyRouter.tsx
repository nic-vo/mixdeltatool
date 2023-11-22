import { useState } from 'react';
import PlaylistAdder from './playlistAdder';
import PlaylistDiffer from './playlistDiffer';

const SpotifyRouter = () => {
	const [nav, setNav] = useState('add');

	return (
		<>
			<div>
				<button onClick={() => setNav('add')}>Add</button>
				<button onClick={() => setNav('diff')}>Diff</button>
			</div>
			{nav === 'add' && <PlaylistAdder />}
			{nav === 'diff' && <PlaylistDiffer />}
		</>
	);
}

export default SpotifyRouter;
