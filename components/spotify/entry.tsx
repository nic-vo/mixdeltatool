import { useSession } from 'next-auth/react';
import { SpotifyMain } from './dynamic';

export default function SpotifyEntry() {
	const { data, status } = useSession({ required: true });
	if (status === 'loading' || !data.user) return <h1>Loading...</h1>
	if (status === 'authenticated' && data.user) {
		return <SpotifyMain user={data.user} />
	};
};
