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
import { saSignOut } from '@/auth';

const ToolRoot = async () => {
	return (
		<GlobalMain className='justify-center'>
			<ToolHeading className='text-center'>
				&uarr; Start up here! &uarr;
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
