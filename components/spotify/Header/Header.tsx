import { useState } from 'react';
import { FaBars, FaHourglassHalf } from 'react-icons/fa';

import look from './Header.module.scss';
import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';

const Hidden = dynamic(import('./HiddenContent'),
	{
		ssr: false,
		loading: ({ error }) => {
			return (error !== null ? <p>Please refresh page.</p> : <p>Loading...</p>)
		}
	})

const Content = () => {
	const { data, status } = useSession();

	return (
		<section className={look.container}>
			<section className={look.info}>
				{
					data !== null && data.user.image ?
						<img
							src={data.user.image}
							alt='profile picture'
							loading='lazy' />
						:
						<div>Image here</div>
				}
				{
					data !== null && data.user.name ?
						<p>{data.user.name}</p>
						:
						<div>Name here</div>
				}
			</section>
			{status === 'authenticated' ? <Hidden /> : <FaHourglassHalf />}
		</section>
	);
}

const Toggler = (props: {
	children: React.ReactNode
}) => {
	const [toggle, setToggle] = useState(false);
	const classer = toggle === true ?
		`${look.header} ${look.active}` : look.header;

	return (
		<header className={classer}>
			<button
				onClick={() => setToggle(!toggle)}
				className={look.toggler}><FaBars /></button>
			<div className={look.returner}
				onClick={() => setToggle(!toggle)} />
			{props.children}
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
