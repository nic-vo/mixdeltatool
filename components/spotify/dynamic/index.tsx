import dynamic from 'next/dynamic';

const SpotifyMain = dynamic(() => import('./dialogue.jsx'),
	{
		loading: () => { return (<h1>Loading profile...</h1>) },
		ssr: false
	});

export {
	SpotifyMain
};
