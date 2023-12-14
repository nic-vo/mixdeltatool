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
			<section className={look.info}>
				{status !== 'authenticated' && <button onClick={() => signIn()}>Sign in</button>}
				{
					data !== undefined && data !== null && data.user.image ?
						<img
							src={data.user.image}
							alt='profile picture'
							loading='lazy' />
						:
						<div>Image here</div>
				}
				{
					data !== undefined && data !== null && data.user.name ?
						<p>{data.user.name}</p>
						:
						<div>Name here</div>
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
		`${look.header} ${look.active}` : look.header;

	return (
		<header className={classer} onFocus={() => setToggle(true)}>
			<button
				onClick={() => setToggle(!toggle)}
				onFocus={() => setToggle(true)}
				className={look.toggler}><FaBars /></button>
			<div className={look.returner}
				onClick={() => setToggle(false)} />
			{props.children}
			<section className={look.innerContainer}>
				<a href='/privacypolicy' className={look.button}>Privacy Policy</a>
				<a href='/' className={look.button} onBlur={() => setToggle(false)}><FaHome /></a>
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
