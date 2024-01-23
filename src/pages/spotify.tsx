import AuthProvider from '@components/auth/provider';
import { SpotEUA } from '@components/legal';
import { Background } from '@components/misc';
import { Header, SpotifyFrame } from '@components/spotify';
import { MAIN_DESC, MAIN_TITLE } from '@consts/spotify';
import { GlobalStatusUpdater } from '@lib/misc';
import Head from 'next/head';

export default function Spotify(props: {
	status: string,
	statusType: string,
	active: number
}) {
	return (
		<>
			<Head>
				<title>{MAIN_TITLE}</title>
				<meta name='description' content={MAIN_DESC} />
			</Head>

			<AuthProvider>
				<Header />
				<main style={{
					position: 'relative',
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					gap: '2svh',
					width: '80svw',
					height: '100svh',
					margin: 'auto',
					zIndex: 1,
				}}>
					<SpotEUA />
					<SpotifyFrame {...props} />
				</main>
			</AuthProvider>
			<Background />
		</>
	);
}

export async function getStaticProps() {
	const globalStatus = await GlobalStatusUpdater();
	return { props: { ...globalStatus } };
}
