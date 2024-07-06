import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import Header from './_components/Header';
import { ClientReduxProvider } from '@/state';
import { UserPersister } from './user/_components';
import { SpecificPersister } from './specific/_components';

import type { PropsWithChildren } from 'react';

const ToolRoot = async (props: PropsWithChildren) => {
	const session = await auth();
	if (!session) redirect(`/api/auth/signin`);

	return (
		<>
			<Header />
			<ClientReduxProvider>
				{props.children}
				<UserPersister />
				<SpecificPersister />
			</ClientReduxProvider>
		</>
	);
};

export default ToolRoot;
