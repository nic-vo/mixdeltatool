import { ServiceStatus } from '@/components/misc';
import Link from 'next/link';

export default async function Home() {
	return (
		<main className='relative min-h-screen z-10 flex flex-col items-center *:max-w-prose *:w-10/12 gap-8'>
			<hgroup className='gap-0 mt-32'>
				<h1 className='font-cabin text-8xl sm:text-9xl font-black'>MixDelta</h1>
				<p className='font-karla text-2xl sm:text-4xl font-extralight'>
					a playlist tool for Spotify
				</p>
			</hgroup>
			<Link
				href='/spotify'
				className='flex gap-2 items-center'>
				<span>To the tool! &rarr;</span>
			</Link>
			<ServiceStatus />
			<h2>About this tool</h2>
			<p>
				Designed for playlist aficionados who curate an extensive library,
				MixDelta empowers you to efficiently compare and manage your playlists
				like never before. Say goodbye to the hassle of manually syncing changes
				across multiple playlists – MixDelta does the heavy lifting for you.
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
