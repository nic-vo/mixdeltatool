import Header from './_components/Header';
import { ClientReduxProvider } from '@/state';
import { UserPersister } from './user/_components';
import { SpecificPersister } from './specific/_components';

import type { PropsWithChildren } from 'react';
import { SessionProvider } from 'next-auth/react';

const ToolRoot = (props: PropsWithChildren) => (
	<SessionProvider refetchOnWindowFocus={false}>
		<Header />
		<ClientReduxProvider>
			{props.children}
			<UserPersister />
			<SpecificPersister />
		</ClientReduxProvider>
	</SessionProvider>
);

export default ToolRoot;
