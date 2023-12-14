import { useState } from 'react';
import PlaylistAdder from './playlistAdder';
import PlaylistDiffer from './playlistDiffer';

import global from '@styles/globals.module.scss';
import local from './Router.module.scss';

const SpotifyRouter = () => {
	const [nav, setNav] = useState('add');

	return (
		<section className={local.container}>
			{nav === 'add' ? (
				<>
					<button
						onClick={() => setNav('diff')}
						className={global.emptyButton}>Go diff</button>
					<PlaylistAdder />
				</>
			) : (
				<>
					<button
						onClick={() => setNav('add')}
						className={global.emptyButton}>Return to add</button>
					<PlaylistDiffer />
				</>
			)}
		</section >
	);
}

export default SpotifyRouter;
