const cyear = new Date().getFullYear().toString();

import local from './Footer.module.scss';

const Footer = () => {
	return (
		<footer className={local.footer}>
			<div className={local.spacer}>
				<p>&#169; MixDelta {cyear}</p>
				<a href='/privacypolicy'>Privacy Policy</a>
				<a href='/contact'>Contact</a>
			</div>
		</footer>
	);
}

export default Footer;
