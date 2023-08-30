import dynamic from 'next/dynamic';

const PlaylistAdder = dynamic(() => import('./PlaylistAdder'),
	{
		loading: () => { return (<h1>Loading playlists...</h1>) },
		ssr: false
	});

export default PlaylistAdder;
