import Header from './_components/Header';
import { ClientReduxProvider } from '@/state';
import { UserPersister } from './user/_components';
import { SpecificPersister } from './specific/_components';

import { Suspense, type PropsWithChildren } from 'react';
import AuthCheck from './_components/AuthCheck';

const ToolRoot = ({ children }: PropsWithChildren) => (
	<>
		<Header />
		<Suspense fallback={null}>
			<AuthCheck />
		</Suspense>
		<ClientReduxProvider>
			{children}
			<UserPersister />
			<SpecificPersister />
		</ClientReduxProvider>
	</>
);

export default ToolRoot;
