import { Cabin, Hind, Karla } from 'next/font/google';

export const cabin = Cabin({
	weight: 'variable',
	preload: false,
	subsets: ['latin', 'latin-ext'],
	variable: '--font-cabin',
});

export const hind = Hind({
	weight: ['300', '400', '700'],
	preload: false,
	subsets: ['latin', 'latin-ext'],
	variable: '--font-hind',
});

export const karla = Karla({
	weight: 'variable',
	preload: false,
	subsets: ['latin'],
	variable: '--font-karla',
});
