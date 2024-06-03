import { Overpass, Noto_Sans } from 'next/font/google';

export const overpass = Overpass({
	weight: 'variable',
	preload: false,
	subsets: ['cyrillic', 'latin', 'latin-ext'],
	variable: '--font-overpass',
});

export const notosans = Noto_Sans({
	weight: 'variable',
	preload: false,
	subsets: ['latin', 'latin-ext', 'cyrillic'],
	variable: '--font-notosans',
});
