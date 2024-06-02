/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
	theme: {
		extend: {
			fontFamily: {
				overpass: '--font-overpass',
				notosans: '--font-notosans',
			},
		},
	},
	plugins: [],
};
