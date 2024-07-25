import Header from './_components/Header';
import { ClientReduxProvider } from '@/state';
import { UserPersister } from './user/_components';
import { SpecificPersister } from './specific/_components';

import type { PropsWithChildren } from 'react';

const ToolRoot = (props: PropsWithChildren) => (
	<>
		<Header />
		<ClientReduxProvider>
			{props.children}
			<UserPersister />
			<SpecificPersister />
		</ClientReduxProvider>
	</>
);

export default ToolRoot;
