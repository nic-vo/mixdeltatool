import { saSignIn, saSignOut } from '@/auth';
import {
	GlobalMain,
	GlobalBlockLink,
	GlobalTextWrapper,
} from '@/components/global/serverComponentUI';
import { ToolHeading } from './_components/server';
import {
	flippedSlider,
	hitsSpotify,
	localNavigation,
} from '@/consts/buttonStates';
import LandingSubmitTimeout from '@/components/global/LandingSubmitTimeout';
import LandingClientCheck from './_components/LandingClientCheck';
import { SessionProvider } from 'next-auth/react';

const signInButtonID = 'landing-signin-button';
const signOutButtonID = 'landing-signout-button';

const ToolRoot = () => (
	<GlobalMain className='gap-8 my-16'>
		<ToolHeading className='text-center'>Start here.</ToolHeading>
		<div className='w-full min-h-32 flex flex-col gap-2 items-center justify-center'>
			<p>Are you signed in?...</p>
			<LandingClientCheck />
		</div>
		<div className='flex flex-col gap-4'>
			<p className='text-center max-w-prose'>
				Ideally, sign in first. You&apos;ll be redirected to sign in if you try
				to use anything, anyway. You&apos;ll also be redirected to sign in if
				your Spotify session has expired.
			</p>
			<form
				action={saSignIn}
				className='flex flex-col items-center w-full'>
				<label htmlFor={signInButtonID}>
					<span className='sr-only'>Click to sign in to the tool</span>
				</label>
				<LandingSubmitTimeout
					id={signInButtonID}
					type='submit'
					className={hitsSpotify + ' border-green-400'}>
					<GlobalTextWrapper>Sign in</GlobalTextWrapper>
				</LandingSubmitTimeout>
			</form>
		</div>
		<div className='flex flex-col gap-4'>
			<p className='text-center'>
				If you&apos;ve already signed in, you can sign out.
			</p>
			<form
				action={saSignOut}
				className='flex flex-col items-center w-full'>
				<label htmlFor={signOutButtonID}>
					<span className='sr-only'>Click to sign out of the tool</span>
				</label>
				<LandingSubmitTimeout
					id={signOutButtonID}
					type='submit'
					className={localNavigation + ' ' + flippedSlider}>
					<GlobalTextWrapper>Sign out</GlobalTextWrapper>
				</LandingSubmitTimeout>
			</form>
		</div>
		<GlobalBlockLink
			href='/'
			className={localNavigation + ' ' + flippedSlider + ' mt-auto'}>
			<GlobalTextWrapper>&larr; Return Home</GlobalTextWrapper>
		</GlobalBlockLink>
	</GlobalMain>
);

export default ToolRoot;

export const metadata = {
	title: 'Start Mixing Here',
	description: 'The MixDelta tool landing page',
};
