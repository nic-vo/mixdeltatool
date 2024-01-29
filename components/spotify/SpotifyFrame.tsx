import { signIn, useSession } from 'next-auth/react';
import { SpotifyMain } from './dynamic';
import { LoadingForDynamic, ServiceStatus } from '@components/misc';

import global from '@styles/globals.module.scss';
import { MixDeltaLogo } from '@consts/spotify';

export default function SpotifyFrame(props: {
	active: number,
	status: string,
	statusType: string
}) {
	const { status } = useSession();

	// return <LoadingForDynamic />

	if (status === 'loading') return <LoadingForDynamic />

	if (status === 'authenticated') return <SpotifyMain />

	return (
		<>
			<h1 style={{
				textAlign: 'center',
				width: '100%',
				marginTop: '15svh'
			}}>Sign in please!</h1>
			<button
				onClick={() => signin('spotify')}
				className={global.emptyButton}
				style={{ margin: '5dvh' }}>Sign In</button>
			<ServiceStatus {...props} />
			<a
				id='home'
				href='/'
				className={global.emptyButton}
				style={{minWidth: '24ch', gap: '0.5em'}}>
				<img
					src={MixDeltaLogo.src}
					alt='Click to return to the homepage'
					style={{
						maxHeight: '64px',
					}} />
				Back to home
			</a>
		</>
	);
}
