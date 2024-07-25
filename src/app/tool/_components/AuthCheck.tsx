import { auth } from '@/auth';
import { redirect } from 'next/navigation';

const AuthCheck = async () => {
	const session = await auth();
	if (session) return null;
	redirect('/login');
};

export default AuthCheck;
