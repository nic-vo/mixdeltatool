'use client';

import { signOut } from 'next-auth/react';
import {
	GlobalButton,
	GlobalTextWrapper,
} from '@/components/global/serverComponentUI';
import { useState, useRef, useEffect, FocusEventHandler } from 'react';
import { IoClose, IoMenu } from 'react-icons/io5';
import { FlatButton, FlatLink } from './server';

const ToggleMenu = () => {
	const [toggled, setToggled] = useState(false);
	const [first, setFirst] = useState(true);
	const unToggleRef = useRef<HTMLButtonElement>(null);

	const closerHandler = () => setToggled(false);
	const containerBlurHandler: FocusEventHandler = (e) => {
		const { relatedTarget, currentTarget } = e;
		if (relatedTarget?.tagName === 'dialog') return;
		if (relatedTarget && !currentTarget.contains(relatedTarget))
			setToggled(false);
	};

	useEffect(() => {
		setFirst(false);
	}, []);

	useEffect(() => {
		if (first) return;
		if (!toggled && unToggleRef.current) unToggleRef.current.focus();
	}, [toggled]);

	return (
		<>
			<GlobalButton
				className={`rounded-full !p-2 z-10 backdrop-brightness-50${
					toggled ? ' text-black bg-white after:translate-x-0' : ''
				}`}
				aria-expanded={toggled}
				aria-controls='submenu-container'
				onClick={() => setToggled(!toggled)}
				tabIndex={toggled ? -1 : 0}
				ref={unToggleRef}
				aria-label='Open menu'>
				<IoMenu
					aria-hidden
					className='block text-2xl relative z-10'
				/>
			</GlobalButton>
			<div
				className={`fixed h-screen top-0 right-0 bg-white w-max z-20 transition-all ${
					toggled ? 'translate-x-0' : 'translate-x-full'
				}`}
				id='submenu-container'
				aria-expanded={toggled}
				onBlur={containerBlurHandler}>
				<div
					className={`${
						toggled ? 'block' : 'hidden'
					} fixed w-screen h-screen -translate-x-full bg-black bg-opacity-90`}
					onClick={() => setToggled(false)}
					aria-hidden></div>
				<GlobalButton
					className='p-1 w-max m-2 rounded-full text-black hover:text-white focus-visible:text-white after:bg-black border-black'
					tabIndex={toggled ? 0 : -1}
					aria-controls='submenu-container'
					onClick={closerHandler}>
					<IoClose
						aria-hidden
						className='block text-xl relative z-10'
					/>
					<GlobalTextWrapper sr>Close menu</GlobalTextWrapper>
				</GlobalButton>
				<nav className='my-8'>
					<ul
						tabIndex={toggled ? 0 : -1}
						className='relative block outline-black focus-visible:outline'>
						<li>
							<FlatLink
								href='/'
								className='border-b'
								tabIndex={toggled ? 0 : -1}>
								<GlobalTextWrapper>Back to homepage</GlobalTextWrapper>
							</FlatLink>
						</li>
						<li>
							<FlatLink
								href='/account'
								className='border-t'
								tabIndex={toggled ? 0 : -1}>
								<GlobalTextWrapper>Delete account</GlobalTextWrapper>
							</FlatLink>
						</li>
					</ul>
				</nav>
				<FlatButton
					onClick={() => signOut()}
					tabIndex={toggled ? 0 : -1}>
					<GlobalTextWrapper>Sign out</GlobalTextWrapper>
				</FlatButton>
			</div>
		</>
	);
};

export default ToggleMenu;
