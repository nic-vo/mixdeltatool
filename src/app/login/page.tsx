import { saSignIn } from '@/auth';
import {
	GlobalBlockLink,
	GlobalButton,
	GlobalMain,
	GlobalTextWrapper,
} from '@/components/global/serverComponentUI';
import { hitsSpotify, localNavigation } from '@/consts/buttonStates';

const LoginPage = () => (
	<GlobalMain className='justify-center'>
		<h1 className='font-cabin font-black text-6xl text-center'>
			First, sign in.
		</h1>
		<form action={saSignIn}>
			<GlobalButton
				className={hitsSpotify}
				type='submit'>
				<GlobalTextWrapper>Sign in</GlobalTextWrapper>
			</GlobalButton>
		</form>
		<GlobalBlockLink
			href='/'
			className={localNavigation}>
			<GlobalTextWrapper>&larr; Return home</GlobalTextWrapper>
		</GlobalBlockLink>
	</GlobalMain>
);

export default LoginPage;
