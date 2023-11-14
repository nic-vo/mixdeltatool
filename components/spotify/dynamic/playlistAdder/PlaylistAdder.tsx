import UserAdder from './userAdder/UserAdder';
import SpecificAdder from './specificAdder/SpecificAdder';
import PlaylistDisplay from './playlistDisplay/PlaylistDisplay';

import styles from './PlaylistAdder.module.scss';

/*

This is basically just a UI for adding playlists to the current session;
Should be auth agnostic, that'll be handled in the playlist context object;
Has to adapt the playlist context's specificPlaylistHandler to a <form>
(the handler's logic is input agnostic, blindly takes in a param object)

*/

export default function PlaylistAdder() {
	return (
		<section className={styles.container}>
			<h2>Get some playlists for the tool</h2>
			<UserAdder>
				<PlaylistDisplay user={true} />
			</UserAdder>
			<SpecificAdder>
				<PlaylistDisplay user={false} />
			</SpecificAdder>
		</section>
	);
};
