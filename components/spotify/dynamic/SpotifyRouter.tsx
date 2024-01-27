import { useState } from 'react';
import PlaylistAdder from './playlistAdder';
import PlaylistDiffer from './playlistDiffer';

import local from './Router.module.scss';

const SpotifyRouter = () => {
	const [onAdder, setOnAdder] = useState(true);

	const leftClasses = [local.button, local.leftButton, local.active];
	const rightClasses = [local.button, local.rightButton, local.active];
	const leftIndex = onAdder ? 3 : 2;
	const rightIndex = !onAdder ? 3 : 2;
	const leftClasser = leftClasses.slice(0, leftIndex).join(' ');
	const rightClasser = rightClasses.slice(0, rightIndex).join(' ');

	return (
		<>
			<div className={local.router}>
				<button
					onClick={() => setOnAdder(true)}
					className={leftClasser}>Add{onAdder&&' lists'}.</button>
				<button
					onClick={() => setOnAdder(false)}
					className={rightClasser}>Diff{!onAdder&&' lists'}.</button>
			</div>
			{onAdder ? <PlaylistAdder /> : <PlaylistDiffer />}
		</>
	);
}

export default SpotifyRouter;
