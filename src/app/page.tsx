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
					<span className='text-myteal'>Mix</span>
					<span className='text-satorange'>Delta</span>
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
					At its core, MixDelta provides a convenient way to compare or
					differentiate any two albums or playlists. After comparing them, it
					generates a new playlist based on what the user wants to do with the
					result of that comparison.
				</p>
				<p>
					Want to remove any duplicate tracks between playlists? Want ONLY the
					duplicate tracks? Want to do that process over a few dozen playlists
					in a quick and orderly fashion? MixDelta steps up to the plate.
				</p>
			</section>
		</GlobalMain>
	);
}
