import InProgressLogo from './InProgressLogo';
import { GlobalMain } from './serverComponentUI';

export const GlobalLoading = ({ display }: { display?: string }) => (
	<GlobalMain
		aria-busy
		aria-live='polite'
		className='justify-center'>
		<h1 className='font-cabin font-black text-center text-5xl'>
			Loading<span className='inline-block animate-pulse'>.</span>
			<span
				className='inline-block animate-pulse'
				style={{ animationDelay: '0.2s' }}>
				.
			</span>
			<span
				className='inline-block animate-pulse'
				style={{ animationDelay: '0.4s' }}>
				.
			</span>
		</h1>
		{display && <p className='max-w-prose text-lg text-slate-500'>{display}</p>}
		<InProgressLogo twSize='size-32' />
	</GlobalMain>
);
