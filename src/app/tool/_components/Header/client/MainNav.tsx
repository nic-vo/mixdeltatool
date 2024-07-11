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
	'after:!translate-x-0 after:!bg-satorange !border-satorange text-black cursor-default border-r-white';
const specClasser =
	'after:!translate-x-0 after:!bg-myteal !border-myteal text-black cursor-default border-l-white';
const diffClasser =
	'after:!translate-y-0 after:!bg-pinkredlight !border-pinkredlight text-black cursor-default';

const MainNav = () => {
	const pathname = usePathname();
	return (
		<nav className='flex-shrink'>
			<ul className='relative flex w-full items-center justify-center divide-x-2'>
				<MainHeaderLI>
					<section className='flex items-center justify-center gap-2 flex-wrap w-full'>
						<h2 className='font-karla text-xl font-thin block text-nowrap'>
							Playlists:
						</h2>
						<ul className='relative flex items-center justify-center shrink-0'>
							<MainHeaderLI>
								<GlobalBlockLink
									href='/tool/specific'
									aria-label='Add specific playlists'
									className={
										flippedSlider +
										' ' +
										'rounded-r-none border-r !p-2' +
										(pathname === '/tool/specific' ? ' ' + specClasser : '')
									}
									tabIndex={pathname === '/tool/specific' ? -1 : 0}>
									<GlobalTextWrapper aria-hidden>Specific</GlobalTextWrapper>
								</GlobalBlockLink>
							</MainHeaderLI>
							<MainHeaderLI>
								<GlobalBlockLink
									href='/tool/user'
									aria-label='Add your playlists'
									className={
										'rounded-l-none border-l !p-2' +
										(pathname === '/tool/user' ? ' ' + yourClasser : '')
									}
									tabIndex={pathname === '/tool/user' ? -1 : 0}>
									<GlobalTextWrapper aria-hidden>Yours</GlobalTextWrapper>
								</GlobalBlockLink>
							</MainHeaderLI>
						</ul>
					</section>
				</MainHeaderLI>
				<MainHeaderLI className='ml-2 pl-2'>
					<GlobalBlockLink
						href='/tool/mixer'
						aria-label='Go to the playlist mixer'
						className={
							'after:translate-x-0 after:translate-y-full after:hover:translate-y-0 after:focus-visible:translate-y-0 !px-4' +
							(pathname === '/tool/mixer' ? ' ' + diffClasser : '')
						}
						tabIndex={pathname === '/tool/mixer' ? -1 : 0}>
						<GlobalTextWrapper aria-hidden>Mixer</GlobalTextWrapper>
					</GlobalBlockLink>
				</MainHeaderLI>
			</ul>
		</nav>
	);
};

export default MainNav;
