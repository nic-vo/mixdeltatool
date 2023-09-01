import dynamic from 'next/dynamic';

const SpotifyMain = dynamic(() => import('./SpotifyMain'), {
	loading: () => <h1>Loading tool...</h1>,
	ssr: false
});

export {
	SpotifyMain,
};
