import { auth, saSignOut } from '@/auth';
import {
	GlobalButton,
	GlobalMain,
	GlobalBlockLink,
} from '@/components/global/serverComponentUI';
import { ToolHeading } from './_components/server';
import {
	flippedSlider,
	hitsSpotify,
	localNavigation,
} from '@/consts/buttonStates';
import { redirect } from 'next/navigation';

const ToolRoot = async () => {
	const session = await auth();
	if (!session) redirect(`/api/auth/signin`);

	return (
		<GlobalMain className='m-auto'>
			<ToolHeading>
				Welcome,{' '}
				{(session.user &&
					(session.user?.name ?? session.user?.email?.split('@')[0])) ??
					'Stranger'}
				!
			</ToolHeading>
			<form action={saSignOut}>
				<GlobalButton
					type='submit'
					className={hitsSpotify}>
					Sign out
				</GlobalButton>
			</form>
			<GlobalBlockLink
				href='/'
				className={localNavigation + ' ' + flippedSlider}>
				&larr; Return Home
			</GlobalBlockLink>
		</GlobalMain>
	);
};

export default ToolRoot;
