import { notosans, overpass } from '@/styles/fonts';
import Background from './_components/Background';

import { PropsWithChildren } from 'react';

import '@/styles/globals.css';

const RootLayout = (props: PropsWithChildren) => {
	return (
		<html lang='en'>
			<body
				className={`${overpass.variable} ${notosans.variable} font-notosans bg-black text-white`}>
				{props.children}
				<Background />
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
