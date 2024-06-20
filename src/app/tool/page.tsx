import { auth } from '@/auth';
import { GlobalButton } from '@/components/global';
import { signIn } from 'next-auth/react';

const ToolRoot = async () => {
	const session = await auth();

	if (!session)
		return (
			<form
				action={async () => {
					'use server';
					await signIn();
				}}>
				<GlobalButton type='submit'>Sign in</GlobalButton>
			</form>
		);

	return (
		<main className='relative flex flex-col items-center gap-4 w-full h-svh m-auto'>
			<h1>Signed in</h1>
			<p>{session.user?.email ?? 'Signed in but sparse info'}</p>
		</main>
	);
};

export default ToolRoot;
