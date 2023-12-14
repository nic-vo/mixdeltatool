import { SpecificPlaylistProvider } from './contexts/SpecificPlaylistProvider';
import { UserPlaylistProvider } from './contexts/UserPlaylistProvider';
import SpotifyRouter from './SpotifyRouter';
import { signIn, useSession } from 'next-auth/react';

import global from '@styles/globals.module.scss';

const SpotifyMain = () => {
	const { status } = useSession();

	if (status === 'authenticated') return (
		<UserPlaylistProvider>
			<SpecificPlaylistProvider>
				<SpotifyRouter />
			</SpecificPlaylistProvider>
		</UserPlaylistProvider>
	)
	return (
		<>
			<h1 style={{ textAlign: 'center', width: '100%' }}>Sign in please!</h1>
			<div>
				<button
					onClick={() => signIn()}
					className={global.emptyButton}>Sign in</button>
			</div>
		</>
	);
}

export default SpotifyMain;
