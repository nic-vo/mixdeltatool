import { signOut, useSession } from 'next-auth/react';
import { SpotifyMain } from './dynamic';

export default function SpotifyEntry() {
	const { data, status } = useSession({ required: true });
	if (status === 'loading' || !data.user) return <h1>Loading...</h1>
	if (status === 'authenticated' && data.user) {
		const { email, image, name } = data.user;
		return (
			<>
				<header>
					<h1>Hello there {email?.split('@')[0] || name}!</h1>
					{image !== null && <img src={image} alt='' />}
					<button onClick={() => signOut()}>Sign out</button>
				</header>
				<SpotifyMain />
			</>
		);
	};
};
