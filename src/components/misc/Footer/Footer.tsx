import local from './Footer.module.scss';

const Footer = () => {
	return (
		<footer className={local.footer}>
			<div className={local.spacer}>
				<a href='/privacypolicy'>Privacy Policy</a>
				<a href='/terms'>Terms</a>
				<a href='/contact'>Contact</a>
			</div>
			<p>&#169; MixDelta 2024</p>
		</footer>
	);
}

export default Footer;
