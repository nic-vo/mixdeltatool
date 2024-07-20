import { Suspense } from 'react';
import MainNav from './client/MainNav';
import ToggleMenu from './client/ToggleMenu';

const ToolHeader = () => {
	return (
		<header className='relative w-full flex justify-center items-center gap-2 p-4 divide-x-2'>
			<Suspense fallback={null}>
				<MainNav />
			</Suspense>
			<div className='pl-2 border-slate-500'>
				<Suspense fallback={null}>
					<ToggleMenu />
				</Suspense>
			</div>
		</header>
	);
};

export default ToolHeader;
