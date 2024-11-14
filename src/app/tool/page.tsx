import { auth, saSignIn, saSignOut } from '@/auth';
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
import { Suspense } from 'react';
import InProgressLogo from '@/components/global/InProgressLogo';
import LandingSubmitTimeout from '@/components/global/LandingSubmitTimeout';

const signInButtonID = 'landing-signin-button';
const signOutButtonID = 'landing-signout-button';

const ToolLanding = async () => {
	const session = await auth();
	if (!session)
		return (
			<>
				<p className='text-center'>
					Ideally, sign in first. You&apos;ll be redirected to sign in if you
					try to use anything, anyway.
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
						className={hitsSpotify}>
						<GlobalTextWrapper>Sign in</GlobalTextWrapper>
					</LandingSubmitTimeout>
				</form>
			</>
		);
	return (
		<>
			<p className='text-center'>
				Welcome,{' '}
				{session.user?.name ?? session.user?.email?.split('@')[0] ?? 'Stranger'}
				!
			</p>
			<form action={saSignOut}>
				<label htmlFor={signOutButtonID}>
					<span className='sr-only'>Click to sign out of the tool</span>
				</label>
				<LandingSubmitTimeout
					id={signOutButtonID}
					type='submit'
					className={hitsSpotify + ' ' + flippedSlider}>
					<GlobalTextWrapper>Sign out</GlobalTextWrapper>
				</LandingSubmitTimeout>
			</form>
		</>
	);
};

const ToolRoot = () => {
	return (
		<GlobalMain className='justify-between my-16'>
			<ToolHeading className='text-center'>Start here.</ToolHeading>
			<div
				aria-live='polite'
				className='flex flex-col items-center gap-8'>
				<Suspense
					fallback={
						<div className='flex items-center'>
							<InProgressLogo twSize='size-32' />
							<span className='animate-pulse font-bold text-3xl'>
								Loading...
							</span>
						</div>
					}>
					<ToolLanding />
				</Suspense>
			</div>
			<GlobalBlockLink
				href='/'
				className={localNavigation + ' ' + flippedSlider}>
				<GlobalTextWrapper>&larr; Return Home</GlobalTextWrapper>
			</GlobalBlockLink>
		</GlobalMain>
	);
};

export default ToolRoot;

export const metadata = {
	title: 'Start Mixing Here',
	description: 'The MixDelta tool landing page',
};
