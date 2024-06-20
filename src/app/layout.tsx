import { cabin, karla, hind } from '@/styles/fonts';
import Background from './_components/Background';
import SpotEUA from './_components/EUA';
import { MotionContextProvider } from './_components/Background/MotionContext';

import { PropsWithChildren } from 'react';

import '@/styles/globals.css';
import Footer from './_components/Footer';

const RootLayout = (props: PropsWithChildren) => {
	return (
		<html lang='en'>
			<body
				className={`${cabin.variable} ${karla.variable} ${hind.variable} font-karla bg-black text-white flex flex-col items-center`}>
				<MotionContextProvider>
					{props.children}
					<SpotEUA />
					<Footer />
					<Background />
				</MotionContextProvider>
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
