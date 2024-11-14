import { saSignIn } from '@/auth';
import {
	GlobalBlockLink,
	GlobalMain,
	GlobalTextWrapper,
} from '@/components/global/serverComponentUI';
import LandingSubmitTimeout from '@/components/global/LandingSubmitTimeout';
import { hitsSpotify, localNavigation } from '@/consts/buttonStates';

const signInButtonID = 'login-signin-button';

const LoginPage = () => (
	<GlobalMain className='justify-center'>
		<h1 className='font-cabin font-black text-6xl text-center'>
			Sign in to start mixing.
		</h1>
		<form action={saSignIn}>
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
		<GlobalBlockLink
			href='/'
			className={localNavigation}>
			<GlobalTextWrapper>&larr; Return home</GlobalTextWrapper>
		</GlobalBlockLink>
	</GlobalMain>
);

export default LoginPage;
