import { Suspense } from 'react';
import MainNav from './client/MainNav';
import ToggleMenu from './client/ToggleMenu';

const ToolHeader = () => {
	return (
		<header className='relative w-full flex justify-center items-center gap-2 p-4'>
			<Suspense fallback={null}>
				<MainNav />
			</Suspense>
			<Suspense fallback={null}>
				<ToggleMenu />
			</Suspense>
		</header>
	);
};

export default ToolHeader;
