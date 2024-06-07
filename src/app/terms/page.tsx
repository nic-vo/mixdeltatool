import local from '@/styles/privacy.module.scss';
import EUAContent, { SmallNav } from '../_components/EUA/server';

const Terms = () => {
	return (
		<>
			<SmallNav />
			<main className='flex flex-col gap-8 w-full max-w-prose mx-0 my-auto p-4'>
				<h1 className='text-center text-5xl'>MixDelta End User Agreement</h1>
				<EUAContent />
			</main>
			<SmallNav />
		</>
	);
};

export default Terms;

export const metadata = {
	title: 'Terms and Conditions | MixDelta',
	description: 'The terms and conditions for MixDelta',
};
