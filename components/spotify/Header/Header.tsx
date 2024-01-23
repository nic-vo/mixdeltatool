import { useState } from 'react';
import { FaBars, FaHome, FaHourglassHalf } from 'react-icons/fa';

import look from './Header.module.scss';
import { signIn, useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';
import { Loading } from '@components/misc';

const Hidden = dynamic(import('./HiddenContent'),
	{
		ssr: false,
		loading: (props: {
			error?: Error | null,
			pastDelay?: boolean,
			timedOut?: boolean
		}) => <Loading
				error={props.error}
				pastDelay={props.pastDelay}
				timedOut={props.timedOut} />
	});

const Content = () => {
	const { data, status } = useSession();
	return (
		<>
			<section className={local.info}>
				{status !== 'authenticated' ?
					<button
						id='header-signin'
						className={global.emptyButton}
						onClick={() => signIn()}>Sign in</button>
					: (<>
						<div style={{ width: '8svh', height: '8svh' }}>
							<ImageLoader url={data.user.image}
								alt={'Profile picture'} />
						</div>
						<p>
							{
								data.user.name ? data.user.name
									: data.user.email ? data.user.email
										: data.user.id
							}
						</p>
					</>
					)
				}
			</section>
			{status === 'authenticated' ? <Hidden /> : <FaHourglassHalf />}
		</>
	);
}

const Toggler = (props: {
	children: React.ReactNode
}) => {
	const [toggle, setToggle] = useState(false);
	const classer = toggle === true ?
		`${local.header} ${local.active}` : local.header;

	const onFocusHandler = (e: React.FocusEvent) => {
		if (e.target.id === 'toggler') return null;
		setToggle(true);
	}

	const onBlurHandler = (e: React.FocusEvent) => {
		if (
			(e.target.id !== 'toggler' || (
				e.relatedTarget !== null && (
					e.relatedTarget.id === 'header-signin'
					|| e.relatedTarget.id === 'delete-account'
				)
			))
			&&
			(e.target.id !== 'home'
				|| (e.relatedTarget !== null
					&& e.relatedTarget.id === 'privacy-policy'))) return null;
		setToggle(false);
	}

	return (
		<header
			className={classer}
			onFocus={onFocusHandler}
			onBlur={onBlurHandler}>
			<button
				id='toggler'
				onClick={() => setToggle(!toggle)}
				className={local.toggler}><FaBars /></button>
			<div className={local.returner}
				onClick={() => setToggle(false)} />
			{props.children}
			<section className={local.innerContainer}>
				<a
					id='home'
					href='/'
					className={local.flatButton}>
					<LogoToAnimate /> Back to home
				</a>
			</section>
		</header>
	);
}

const Header = () => {
	return (
		<Toggler>
			<Content />
		</Toggler>
	);
}

export default Header;
