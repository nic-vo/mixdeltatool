import { InProgressLogo } from '../misc';
import { GlobalMain } from './serverComponentUI';

export const GlobalLoading = ({ display }: { display?: string }) => (
	<GlobalMain
		aria-busy
		aria-live='polite'>
		<h1 className='font-cabin font-light text-center text-5xl animate-pulse'>
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
		{display && <p>{display}</p>}
		<InProgressLogo />
	</GlobalMain>
);
