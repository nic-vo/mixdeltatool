/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
	theme: {
		extend: {
			fontFamily: {
				cabin: 'var(--font-cabin), sans-serif, ui-sans-serif, system-ui',
				hind: 'var(--font-hind), sans-serif, ui-sans-serif, system-ui',
				karla: 'var(--font-karla), serif, ui-serif, system-ui',
			},
			colors: {
				white: '#ededed',
				black: '#121218',
				pinkred: '#d56062',
				pinkredlight: '#eaaeaf',
				satorange: '#f79824',
				lightorange: '#ffc482',
				whiteorange: '#fffbdb',
				myteal: '#0cbaba',
			},
		},
	},
	plugins: [],
};
