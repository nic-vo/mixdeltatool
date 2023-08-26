import type { User } from 'next-auth';
import { signIn, signOut } from 'next-auth/react';
import { PlaylistContext } from '../playlistProvider';
import { useContext } from 'react';
import { myContext } from '../types';

import styles from './dialogue.module.scss';

export default function SpotifyDialogue(props: { user: User }) {
	if (!props.user) return (
		<>
			<h1>Oops, looks like you're not logged in somehow.</h1>
			<button onClick={() => signIn()}>Sign in here</button>
		</>
	);

	const { name, email, image } = props.user;
	const { error,
		loading,
		getUserPlaylistsHandler,
		userPlaylists,
		nextPage } = useContext<myContext>(PlaylistContext);

	return (
		<>
			<h1>Hello there {email?.split('@')[0] || name}!</h1>
			{image !== null && <img src={image} alt='' />}
			<button onClick={() => signOut()}>Sign out</button>
			<button
				onClick={getUserPlaylistsHandler}
				disabled={loading || nextPage === null}>
				Get Playlists</button>
			<p>Next page {nextPage !== null ? nextPage : 'end'}</p>
			{error && <p>{error}</p>}
			{userPlaylists !== null &&
				userPlaylists !== undefined && (
					<ul>
						{userPlaylists.map((playlist) => {
							return (
								<li key={playlist.id}>
									{playlist.image !== undefined
										&& playlist.image.url !== undefined
										&& <img src={playlist.image.url} alt='' />}
									<p>{playlist.name}</p>
									<p>{playlist.owner.display_name}</p>
								</li>
							)
						})}
					</ul>
				)}
		</>
	);
};
