import { useSession } from 'next-auth/react';
import { SpotifyMain } from './dynamic';
import Header from './Header/Header';

export default function SpotifyEntry() {
	const { data, status } = useSession({ required: true });
	if (status === 'authenticated' && data.user) {
		return (
			<>
				<Header />
				<SpotifyMain />
			</>
		);
	}
	return <h1>Loading...</h1>
}
