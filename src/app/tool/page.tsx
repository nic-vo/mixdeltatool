import { auth, saSignIn, saSignOut } from '@/auth';
import {
	GlobalButton,
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

const ToolRoot = async () => {
	const session = await auth();
	if (!session)
		return (
			<GlobalMain className='justify-center'>
				<ToolHeading className='text-center'>
					Ideally, sign in first.
				</ToolHeading>
				<p>
					You&apos;ll be redirected to sign in if you try to use anything
					anyway.
				</p>
				<form action={saSignIn}>
					<GlobalButton
						type='submit'
						className={hitsSpotify}>
						<GlobalTextWrapper>Sign in</GlobalTextWrapper>
					</GlobalButton>
				</form>
				<GlobalBlockLink
					href='/'
					className={localNavigation + ' ' + flippedSlider}>
					<GlobalTextWrapper>&larr; Return Home</GlobalTextWrapper>
				</GlobalBlockLink>
			</GlobalMain>
		);

	return (
		<GlobalMain className='justify-center'>
			<ToolHeading className='text-center'>
				Welcome,{' '}
				{(session.user &&
					(session.user?.name ?? session.user?.email?.split('@')[0])) ??
					'Stranger'}
				!
			</ToolHeading>
			<form action={saSignOut}>
				<GlobalButton
					type='submit'
					className={hitsSpotify + ' ' + flippedSlider}>
					<GlobalTextWrapper>Sign out</GlobalTextWrapper>
				</GlobalButton>
			</form>
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
