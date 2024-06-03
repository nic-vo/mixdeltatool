import { ServiceStatus } from '@/components/misc';
import { IoChevronForwardCircleSharp } from 'react-icons/io5';

export default async function Home() {
	return (
		<main className='min-h-screen'>
			<h1 className='font-overpass text-3xl'>
				Welcome to the MixDelta tool for Spotify!
			</h1>
			<a href='/spotify'>
				To the tool! <IoChevronForwardCircleSharp aria-hidden={true} />
			</a>
			<ServiceStatus />
			<h2>About this tool</h2>
			<p>
				Welcome to MixDelta, your ultimate companion for mastering your Spotify
				playlists with ease. Designed for playlist aficionados who curate an
				extensive library, MixDelta empowers you to efficiently compare and
				manage your playlists like never before. Say goodbye to the hassle of
				manually syncing changes across multiple playlists – MixDelta does the
				heavy lifting for you.
			</p>
			<p>
				With MixDelta, you can seamlessly compare two Spotify playlists,
				identifying shared tracks and unique gems in each. Tailor your new
				playlists based on your preferences – whether you want a compilation of
				shared tracks, exclusive additions from each playlist, or any
				combination in between. The power is in your hands.
			</p>
		</main>
	);
}
