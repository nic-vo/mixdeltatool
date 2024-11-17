'use client';

import InProgressLogo from '@/components/global/InProgressLogo';
import { useSession } from 'next-auth/react';

const LandingClientCheck = () => {
	const { status, data } = useSession();

	if (status === 'loading') return;
	<InProgressLogo twSize='size-8' />;

	if (status === 'unauthenticated' || !data)
		return (
			<p className='text-2xl font-bold text-pinkred'>You are not signed in.</p>
		);

	return (
		<p className='text-2xl font-bold text-lightteal'>
			Welcome, {data.user?.name ?? data.user?.email ?? 'Stranger'}!
		</p>
	);
};

export default LandingClientCheck;
