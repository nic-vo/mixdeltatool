import { PlaylistContext } from '../playlistProvider';
import { useContext, useRef } from 'react';

import styles from './dialogue.module.scss';

const formDataFieldName = 'href';

export default function SpotifyDialogue() {
	const fieldRef = useRef<HTMLInputElement | null>(null);
	const { userError,
		userLoading,
		getUserPlaylistsHandler,
		getSpecificPlaylistHandler,
		specificLoading,
		specificError,
		clearUserPlaylistsHandler,
		userPlaylists,
		specificPlaylists,
		userCurrentPage } = useContext(PlaylistContext);

	const specificPlaylistFormHandler = async (e: React.SyntheticEvent) => {
		e.preventDefault();
		const hrefField = fieldRef.current as HTMLInputElement;
		if (hrefField !== null
			&& hrefField !== undefined
			&& typeof (hrefField.value) === 'string') {
			// Split off the domain and URI beginning, then the weird query
			const splitBegin = hrefField.value.split('.com/')[1];
			const type = splitBegin.split('/')[0];
			const id = splitBegin.split('/')[1].split('?si')[0];
			await getSpecificPlaylistHandler({ type, id });
		}
		return null;
	}

	return (
		<>
			<section>
				<h2>Your playlists</h2>
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
				<ul>
					{userPlaylists !== null &&
						userPlaylists !== undefined && (
							<>
								{
									userPlaylists.map((playlist) => {
										return (
											<li key={playlist.id}>
												{playlist.image !== undefined
													&& playlist.image.url !== undefined
													&& <img src={playlist.image.url} alt='' />}
												<p>{playlist.name}</p>
												<p>{playlist.id}</p>
												<p>{playlist.owner.display_name}</p>
											</li>
										)
									})
								}
							</>
						)}
				</ul>
			</section>
			<section>
				<h2>Random playlists</h2>
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
				<ul>
					{specificPlaylists !== null &&
						specificPlaylists !== undefined && (
							<>
								{specificPlaylists.map((playlist) => {
									return (
										<li key={playlist.id}>
											{playlist.image !== undefined
												&& playlist.image.url !== undefined
												&& <img src={playlist.image.url} alt='' />}
											<p>{playlist.name}</p>
											<p>{playlist.id}</p>
											<p>{playlist.owner.display_name}</p>
										</li>
									);
								})}
							</>
						)}
				</ul>
			</section>
		</>
	);
};
