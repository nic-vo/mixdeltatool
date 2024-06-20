import Link from 'next/link';

import { PropsWithChildren } from 'react';

const FooterNavListItem = (props: PropsWithChildren) => {
	return (
		<li
			tabIndex={-1}
			className='border-white last:sm:border-r'>
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
			className='block p-2 focus-visible:outline outline-white rounded-2xl transition-all'>
			{props.children}
		</Link>
	);
};

const Footer = () => {
	return (
		<footer className='flex flex-col sm:flex-row items-center justify-center w-full min-h-[10svh] p-8 gap-4 bg-gradient-to-t from-black to-transparent z-10 relative'>
			<nav className='flex justify-center'>
				<ul
					className='flex gap-4 sm:gap-0 sm:flex-row sm:divide-x'
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
