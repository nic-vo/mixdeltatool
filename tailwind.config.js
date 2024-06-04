/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
	theme: {
		extend: {
			fontFamily: {
				overpass: '--font-overpass, sans-serif, ui-sans-serif, system-ui',
				notosans: '--font-notosans, sans-serif, ui-sans-serif, system-ui',
			},
			colors: {
				black: '#121218',
				white: '#ededed',
				pinkred: '#d56062',
				satorange: '#f79824',
				lightorange: '#ffc482',
				whiteorange: '#fffbdb',
				myteal: '#0cbaba',
			},
		},
	},
	plugins: [],
};
