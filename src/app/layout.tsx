import { cabin, karla, hind } from '@/styles/fonts';
import Background, { BackgroundToggler } from './_components/Background';
import SpotEUA from './_components/EUA';
import { MotionContextProvider } from './_components/Background/MotionContext';
import Footer from './_components/Footer';
import ServiceStatus from './_components/ServiceStatus';

import { PropsWithChildren, Suspense } from 'react';

import '@/styles/globals.css';

const RootLayout = (props: PropsWithChildren) => {
	return (
		<html lang='en'>
			<body
				className={`${cabin.variable} ${karla.variable} ${hind.variable} font-hind bg-black text-white flex flex-col items-center h-screen justify-between overflow-hidden`}>
				<div
					id='beacon'
					tabIndex={-1}
					aria-hidden
					className='fixed'></div>
				<Suspense fallback={null}>
					<SpotEUA />
				</Suspense>
				<ServiceStatus />
				<MotionContextProvider>
					<Background />
					<BackgroundToggler />
				</MotionContextProvider>
				{props.children}
				<Footer />
			</body>
		</html>
	);
};

export default RootLayout;

export const metadata = {
	title: 'Compare / Trim Spotify playlists | MixDelta',
	description:
		'MixDelta is a tool for Spotify users to compare playlists and edit them based on the comparisons.',
	keywords:
		'Spotify playlist, Spotify playlist comparison, Spotify playlist tool, compare Spotify playlist, playlist cleanup'.split(
			', '
		),
};
