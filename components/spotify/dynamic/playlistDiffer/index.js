import dynamic from 'next/dynamic';

const PlaylistDiffer = dynamic(() => import('./PlaylistDiffer'),
	{
		loading: () => { return (<h1>Loading differ...</h1>) },
		ssr: false
	});

export default PlaylistDiffer;
