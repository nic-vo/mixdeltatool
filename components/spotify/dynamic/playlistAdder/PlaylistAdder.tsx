import { useState } from 'react';
import UserAdder from './userAdder/UserAdder';
import SpecificAdder from './specificAdder/SpecificAdder';
import PlaylistDisplay from './playlistDisplay/PlaylistDisplay';

import look from './PlaylistAdder.module.scss';

/*

This is basically just a UI for adding playlists to the current session;
Should be auth agnostic, that'll be handled in the playlist context object;
Has to adapt the playlist context's specificPlaylistHandler to a <form>
(the handler's logic is input agnostic, blindly takes in a param object)

*/

export default function PlaylistAdder() {
	const [onUser, setOnUser] = useState(true);

	return (
		<section className={look.container}>
			<h1>Get some playlists for the tool</h1>
			<section>
				<button onClick={() => setOnUser(true)}>Your playlists</button>
				<button onClick={() => setOnUser(false)}>Other playlists</button>
			</section>
			{
				onUser ?
					<UserAdder>
						<PlaylistDisplay user={true} />
					</UserAdder>
					:
					<SpecificAdder>
						<PlaylistDisplay user={false} />
					</SpecificAdder>
			}
		</section >
	);
};
