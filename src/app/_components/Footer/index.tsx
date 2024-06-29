import { FooterLink } from './client';

import { PropsWithChildren } from 'react';

const FooterNavListItem = (props: PropsWithChildren) => (
	<li tabIndex={-1}>{props.children}</li>
);
const Footer = () => (
	<footer className='flex flex-col sm:flex-row items-center justify-center w-full min-h-[10svh] py-4 gap-4 bg-gradient-to-t from-black to-transparent z-10 relative font-bold'>
		<nav
			className='flex justify-center'
			aria-label='Footer navigation'>
			<ul
				className='flex gap-4 sm:flex-row'
				tabIndex={-1}>
				<FooterNavListItem>
					<FooterLink href='/privacy-policy'>Privacy Policy</FooterLink>
				</FooterNavListItem>
				<FooterNavListItem>
					<FooterLink href='/terms'>Terms</FooterLink>
				</FooterNavListItem>
				<FooterNavListItem>
					<FooterLink href='/contact'>Contact</FooterLink>
				</FooterNavListItem>
			</ul>
		</nav>
		<p>&#169;MixDelta 2024</p>
	</footer>
);

export default Footer;
