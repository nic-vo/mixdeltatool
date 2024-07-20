/*
This component accepts a string[] of class names
for each segment of the logo for animation purposes
*/

import { AriaAttributes } from 'react';

const LogoToAnimate = ({
	main,
	left,
	middle,
	right,
	...arias
}: {
	main?: string[];
	left?: string[];
	middle?: string[];
	right?: string[];
} & AriaAttributes) => {
	const mainClasser = `min-h-8 min-w-8 ${
		main && main.length > 0 ? main.join(' ') : ''
	}`;
	const leftClasser = left && left.length > 0 ? left.join(' ') : '';
	const middleClasser = middle && middle.length > 0 ? middle.join(' ') : '';
	const rightClasser = right && right.length > 0 ? right.join(' ') : '';

	return (
		<svg
			version='1.1'
			xmlns='http://www.w3.org/2000/svg'
			xmlnsXlink='http://www.w3.org/1999/xlink'
			x='0px'
			y='0px'
			viewBox='0 0 64 64'
			xmlSpace='preserve'
			className={mainClasser}
			{...arias}>
			<polygon
				className={leftClasser}
				points='23.67,17.52 4.7,47.18 19.4,47.18 31.02,29.02'
				style={{ fill: '#0cbaba' }}
			/>
			<polygon
				className={rightClasser}
				points='32.98,29.02 44.6,47.18 59.3,47.18 40.33,17.52'
				style={{ fill: '#ffc482' }}
			/>
			<polygon
				className={middleClasser}
				points='21.36,47.18 42.64,47.18 32,30.55'
				style={{ fill: '#d56062' }}
			/>
		</svg>
	);
};

export default LogoToAnimate;
