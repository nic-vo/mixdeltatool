import local from './LogoToAnimate.module.scss';

/*
This component accepts a string[] of class names
for each segment of the logo for animation purposes
*/

const LogoToAnimate = (props: {
	left?: string[],
	middle?: string[],
	right?: string[]
}) => {
	const { left, middle, right } = props;
	const leftClasser = local.left.concat(
		' ', left && left.length > 0 ? left.join(' ') : '');
	const middleClasser = local.middle.concat(
		' ', middle && middle.length > 0 ? middle.join(' ') : '');
	const rightClasser = local.right.concat(
		' ', right && right.length > 0 ? right.join(' ') : '');

	return (
		<svg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlnsXlink='http://www.w3.org/1999/xlink' x='0px' y='0px'
			viewBox='0 0 64 64' xmlSpace='preserve' className={local.svg}>
			<style type='text/css'>
				.st3{'{'}fill:#FFCC99;{'}'}
				.st4{'{'}fill:#00CCCC;{'}'}
				.st5{'{'}fill:#D56062;{'}'}
			</style>
			<polygon className={leftClasser} points='23.67,17.52 4.7,47.18 19.4,47.18 31.02,29.02' />
			<polygon className={rightClasser} points='32.98,29.02 44.6,47.18 59.3,47.18 40.33,17.52' />
			<polygon className={middleClasser} points='21.36,47.18 42.64,47.18 32,30.55' />
		</svg >
	);
}

export default LogoToAnimate;
