import AuthProvider from '@components/auth/provider';
import { SpotEUA } from '@components/legal';
import { Background } from '@components/misc';
import { Header, SpotifyFrame } from '@components/spotify';
import { getGlobalStatusProps } from '@lib/database/mongoose';
import Head from 'next/head';

export default function Spotify(props: {
	status: string,
	statusType: string,
	active: number
}) {
	return (
		<>
			<Head>
				<title>Compare Spotify playlists and make bulk changes | MixDelta</title>
				<meta name='description' content='A tool for Spotify users to compare playlists and edit them based on the comparisons.' />
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
	const globalStatus = await getGlobalStatusProps();
	return { props: { ...globalStatus } };
}
