import EUAContent, { SmallNav } from '@/components/global/bodyText';
import { GlobalMain } from '@/components/global/serverComponentUI';

const Terms = () => (
	<GlobalMain className='max-w-prose mt-16 mb-8 !overflow-auto px-2 outline-white focus-visible:outline'>
		<header className='flex flex-col gap-4 w-full'>
			<h1 className='text-center font-cabin font-black text-5xl'>
				MixDelta End User Agreement
			</h1>
			<SmallNav />
		</header>
		<EUAContent />
		<footer className='w-full'>
			<SmallNav />
		</footer>
	</GlobalMain>
);

export default Terms;

export const metadata = {
	title: 'Terms and Conditions',
	description: 'The terms and conditions for MixDelta',
};
