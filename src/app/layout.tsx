import { PropsWithChildren } from 'react';
import { Overpass, Noto_Sans } from 'next/font/google';

import '@/styles/globals.css';
import { Background } from '@/components/misc';

const overpass = Overpass({
	weight: 'variable',
	preload: false,
	subsets: ['cyrillic', 'latin', 'latin-ext'],
	variable: '--font-overpass',
});

const notosans = Noto_Sans({
	weight: 'variable',
	preload: false,
	subsets: ['latin', 'latin-ext', 'cyrillic'],
	variable: '--font-notosans',
});

const RootLayout = (props: PropsWithChildren) => {
	return (
		<html lang='en'>
			<body
				className={`${overpass.variable} ${notosans.variable} font-notosans bg-slate-950`}>
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
