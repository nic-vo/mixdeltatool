import dynamic from 'next/dynamic';
import { PlaylistProvider } from './playlistProvider';

const SpotifyMain = dynamic(() => import('./dialogue'),
	{
		loading: () => { return (<h1>Loading profile...</h1>) },
		ssr: false
	});

export {
	SpotifyMain,
	PlaylistProvider
};
