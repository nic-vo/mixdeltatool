import Link from 'next/link';

import { PropsWithChildren } from 'react';

const FooterNavListItem = (props: PropsWithChildren) => {
	return (
		<li
			tabIndex={-1}
			className='border-white last:border-r'>
			{props.children}
		</li>
	);
};

const FooterLink = (props: PropsWithChildren & { href: string }) => {
	return (
		<Link
			href={props.href}
			prefetch={false}
			target='_blank'
			className='outline-none focus-visible:'>
			{props.children}
		</Link>
	);
};

const Footer = () => {
	return (
		<footer className='flex flex-col sm:flex-row items-center justicy-center w-full min-h-[10svh] py-8 gap-4 bg-gradient-to-t from-black to-transparent'>
			<nav className='flex items-center justify-center'>
				<ul
					className='sm:divide-x'
					tabIndex={-1}>
					<FooterNavListItem>
						<FooterLink href='/privacypolicy'>Privacy Policy</FooterLink>
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
};

export default Footer;
