import { auth } from '@/auth';
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
import { redirect } from 'next/navigation';
import { saSignOut } from '@/auth';

const ToolRoot = async () => {
	const session = await auth();
	if (!session) redirect(`/api/auth/signin`);

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
