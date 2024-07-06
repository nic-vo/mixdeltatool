'use client';

import {
	GlobalBlockLink,
	GlobalTextWrapper,
} from '@/components/global/serverComponentUI';
import { flippedSlider } from '@/consts/buttonStates';
import { usePathname } from 'next/navigation';
import { PropsWithChildren } from 'react';

const MainHeaderLI = (props: PropsWithChildren & { className?: string }) => (
	<li
		className={`relative block${props.className ? ` ${props.className}` : ''}`}>
		{props.children}
	</li>
);

const yourClasser =
	'before:!translate-x-0 before:!bg-myteal !border-myteal text-black cursor-default border-r-white';
const specClasser =
	'before:translate-x-0 before:!bg-satorange !border-satorange text-black cursor-default border-l-white';
const diffClasser =
	'before:!translate-y-0 before:!bg-pinkredlight !border-pinkredlight text-black cursor-default';

const MainNav = () => {
	const pathname = usePathname();
	return (
		<nav>
			<ul className='relative flex w-full items-center justify-center'>
				<MainHeaderLI>
					<GlobalBlockLink
						href='/tool/user'
						aria-label='Add your playlists'
						className={
							flippedSlider +
							' ' +
							'rounded-r-none border-r px-4' +
							(pathname === '/tool/user' ? ' ' + yourClasser : '')
						}
						tabIndex={pathname === '/tool/user' ? -1 : 0}>
						<GlobalTextWrapper aria-hidden>Yours</GlobalTextWrapper>
					</GlobalBlockLink>
				</MainHeaderLI>
				<MainHeaderLI>
					<GlobalBlockLink
						href='/tool/specific'
						aria-label='Add specific playlists'
						className={
							'rounded-l-none border-l px-4' +
							(pathname === '/tool/specific' ? ' ' + specClasser : '')
						}
						tabIndex={pathname === '/tool/specific' ? -1 : 0}>
						<GlobalTextWrapper aria-hidden>Specific</GlobalTextWrapper>
					</GlobalBlockLink>
				</MainHeaderLI>
				<MainHeaderLI className='ml-2'>
					<GlobalBlockLink
						href='/tool/differ'
						aria-label='Go to the differ'
						className={
							'before:translate-x-0 before:translate-y-full before:hover:translate-y-0 before:focus-visible:translate-y-0 px-2' +
							(pathname === '/tool/differ' ? ' ' + diffClasser : '')
						}
						tabIndex={pathname === '/tool/differ' ? -1 : 0}>
						<GlobalTextWrapper aria-hidden>Differ</GlobalTextWrapper>
					</GlobalBlockLink>
				</MainHeaderLI>
			</ul>
		</nav>
	);
};

export default MainNav;
