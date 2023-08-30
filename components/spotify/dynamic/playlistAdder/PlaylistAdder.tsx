import { PlaylistContext } from '../playlistProvider';
import PlaylistDisplay from './playlistDisplay/PlaylistDisplay';
import { useContext, useRef } from 'react';

import styles from './PlaylistAdder.module.scss';

const formDataFieldName = 'href';

/*

This is basically just a UI for adding playlists to the current session;
Should be auth agnostic, that'll be handled in the playlist context object;
Has to adapt the playlist context's specificPlaylistHandler to a <form>
(the handler's logic is input agnostic, blindly takes in a param object)

*/

export default function PlaylistAdder() {
	// Ref for non-stateful input
	const fieldRef = useRef<HTMLInputElement | null>(null);

	// Basically dump most of the context here because it requires every bit
	const {
		getUserPlaylistsHandler, userCurrentPage, userLoading, userError,
		getSpecificPlaylistHandler, specificLoading, specificError,
		clearUserPlaylistsHandler,
	} = useContext(PlaylistContext);

	const specificPlaylistFormHandler = async (e: React.SyntheticEvent) => {
		// Adapts the UI to the UI-agnostic fetcher from the playlist context
		e.preventDefault();
		const hrefField = fieldRef.current;
		if (hrefField !== null) {
			// Split off the domain and URI beginning, then the weird query
			// Hopefully the <input>'s pattern is broad enough
			// Should accept any playlist/ or album/
			const splitBegin = hrefField.value.split('.com/')[1];
			const type = splitBegin.split('/')[0];
			const id = splitBegin.split('/')[1].split('?si')[0];
			// A bit weird that the logic for handling the error isn't here
			// Possibly anti-pattern; but this UI is purely meant to adapt
			// The handler
			await getSpecificPlaylistHandler({ type, id });
		};
		return null;
	};

	return (
		<>
			<section>
				<h2>Browse your playlists</h2>
				<section>
					<button
						onClick={getUserPlaylistsHandler}
						disabled={userLoading || userCurrentPage === null}>
						Get your playlists</button>
					<button
						onClick={clearUserPlaylistsHandler}
						disabled={userLoading}>
						Clear your playlists</button>
					<p>Next page {userCurrentPage !== null ? userCurrentPage : 'end'}</p>
					<p>User {userLoading ? 'loading' : 'idle'}</p>
					<p>{userError !== null && userError}</p>
				</section>
				<PlaylistDisplay user={true} />
			</section>
			<section>
				<h2>Get random playlists</h2>
				<section>
					<form
						name='getSpecificPlaylist'
						onSubmit={specificPlaylistFormHandler}>
						<input
							disabled={specificLoading}
							name={formDataFieldName}
							type='text'
							autoComplete='off'
							pattern='^(https:\/\/\w+.spotify.com\/playlist\/[A-Za-z0-9]{22}\?si=[A-Za-z0-9]+)|(https:\/\/\w+.spotify.com\/album\/[A-Za-z0-9]{22}\?si=[A-Za-z0-9-]+)$'
							required
							ref={fieldRef} />
						<button
							type='submit'
							disabled={specificLoading}>Get playlist</button>
					</form>
					<p>specific {specificLoading ? 'loading' : 'idle'}</p>
					<p>{specificError !== null && specificError}</p>
				</section>
				<PlaylistDisplay user={false} />
			</section>
		</>
	);
};
