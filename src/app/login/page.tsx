import { saSignIn } from '@/auth';
import {
	GlobalButton,
	GlobalMain,
	GlobalTextWrapper,
} from '@/components/global/serverComponentUI';
import { hitsSpotify } from '@/consts/buttonStates';

const LoginPage = () => (
	<GlobalMain className='flex flex-col gap-8 justify-center'>
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
	</GlobalMain>
);

export default LoginPage;
