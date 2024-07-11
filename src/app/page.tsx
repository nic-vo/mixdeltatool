import {
	GlobalBlockLink,
	GlobalMain,
	GlobalTextWrapper,
} from '@/components/global/serverComponentUI';
import { localNavigation } from '@/consts/buttonStates';

export default async function Home() {
	return (
		<GlobalMain className='lg:m-auto lg:grid gap-8 grid-cols-2'>
			<hgroup className='mt-32 lg:mt-0 w-full lg:text-right lg:self-end'>
				<h1 className='font-cabin text-8xl sm:text-9xl lg:text-8xl xl:text-9xl font-black'>
					MixDelta
				</h1>
				<p className='font-karla text-2xl sm:text-4xl lg:text-2xl xl:text-4xl font-extralight'>
					a playlist tool for Spotify
				</p>
			</hgroup>
			<GlobalBlockLink
				href='/tool'
				className={
					localNavigation + ' lg:justify-self-end self-start lg:col-start-1'
				}>
				<GlobalTextWrapper>To the tool! &rarr;</GlobalTextWrapper>
			</GlobalBlockLink>
			<section className='w-full *:max-w-prose lg:row-start-2 lg:self-start col-start-2 flex flex-col gap-4 self-end'>
				<h2 className='font-bold text-5xl font-hind'>About this tool</h2>
				<p>
					It&apos;s simple: a user can use MixDelta to identify all similarities
					and differences between any two playlists. After scanning, it can
					quickly generate a new playlist based on what the user specifies, such
					as retaining only unique tracks or including only those present in
					both playlists.
				</p>
				<p>
					MixDelta streamlines managing Spotify playlists by providing a
					seamless way to compare tracklists.
				</p>
			</section>
		</GlobalMain>
	);
}
