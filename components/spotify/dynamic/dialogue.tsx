import type { User } from 'next-auth';
import { signIn, signOut } from 'next-auth/react';
import usePlaylists from '../hooks/playlists';

import type { MySpotifyPlaylistResponse } from '@lib/types/spotify';

export default function SpotifyDialogue(props: { user: User }) {
	if (!props.user) return (
		<>
			<h1>Oops, looks like you're not logged in somehow.</h1>
			<button onClick={() => signIn()}>Sign in here</button>
		</>
	);

	const { name, email, image } = props.user;
	const { error, loading, getPlaylistsHandler, playlists } = usePlaylists();

	return (
		<>
			<h1>Hello there {email?.split('@')[0] || name}!</h1>
			{image !== null && <img src={image} alt='' />}
			<button onClick={() => signOut()}>Sign out</button>
			<button
				onClick={getPlaylistsHandler}
				disabled={loading}>Get Playlists</button>
			{error && <p>{error}</p>}
			{playlists !== null && (
				<ul>
					{playlists.map((playlist) => {
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
