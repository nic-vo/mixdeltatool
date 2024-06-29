import EUAContent, { SmallNav } from '../_components/EUA/server';
import { GlobalMain } from '@/components/global/serverComponentUI';

const Terms = () => (
	<GlobalMain className='*:max-w-prose mt-32'>
		<h1 className='text-center font-cabin font-black text-5xl'>
			MixDelta End User Agreement
		</h1>
		<EUAContent />
		<SmallNav />
	</GlobalMain>
);

export default Terms;

export const metadata = {
	title: 'Terms and Conditions | MixDelta',
	description: 'The terms and conditions for MixDelta',
};
