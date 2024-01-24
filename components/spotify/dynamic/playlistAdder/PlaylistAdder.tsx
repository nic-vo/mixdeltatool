import { useState } from 'react';
import UserAdder from './userAdder/UserAdder';
import SpecificAdder from './specificAdder/SpecificAdder';
import UserList from './playlistDisplay/UserList';
import SpecificList from './playlistDisplay/SpecificList';
import ClearPlaylistButton from './ClearPlaylistButton/ClearPlaylistButton';

import local from './PlaylistAdder.module.scss';

/*

This is basically just a UI for adding playlists to the current session;
Should be auth agnostic, that'll be handled in the playlist context object;
Has to adapt the playlist context's specificPlaylistHandler to a <form>
(the handler's logic is input agnostic, blindly takes in a param object)

*/

export default function PlaylistAdder() {
	const [onUser, setOnUser] = useState(true);
	const leftClasses = [local.button, local.leftButton, local.active];
	const rightClasses = [local.button, local.rightButton, local.active];
	const leftClasser = leftClasses.slice(0, !onUser ? 3 : 2).join(' ');
	const rightClasser = rightClasses.slice(0, onUser ? 3 : 2).join(' ');

	return (
		<section className={local.container}>
			<h1 className={local.heading}>Retrieve playlists:</h1>
			<div className={local.router}>
				<button
					tabIndex={0}
					onClick={() => setOnUser(false)}
					className={leftClasser}>Specific</button>
				<button
					tabIndex={0}
					onClick={() => setOnUser(true)}
					className={rightClasser}>Yours</button>
			</div>
			<div className={local.controls}>
				{onUser ? <UserAdder /> : <SpecificAdder />}
			</div>
			<div className={local.list}>
				{onUser ? <UserList /> : <SpecificList />}
				<ClearPlaylistButton user={onUser} />
			</div>
		</section >
	);
};
