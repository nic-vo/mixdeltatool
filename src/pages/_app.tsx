import type { AppProps } from 'next/app'

import '@styles/globals.css';
import Head from 'next/head';
import { Footer } from '@components/misc';

export default function MyApp({ Component, pageProps }: AppProps) {
	return (
		<>
			<Head>
				<meta name='keywords' content='spotify playlist, spotify playlist comparison, spotify playlist tool, compare spotify playlist, spotify playlist, playlist cleanup' />
				<meta charSet='UTF-8' />
				<meta httpEquiv='X-UA-Compatible' content='IE=edge' />
				<meta name='viewport' content='width=device-width, initial-scale=1.0' />
			</Head>

			<Component {...pageProps} />
			<Footer />
		</>
	);
};
