import { InProgressLogo } from '../misc';

export const GlobalLoading = () => (
	<main
		className='relative z-10 flex flex-col justify-center gap-8 items-center m-auto'
		aria-busy>
		<h2 className='font-hind font-light text-center text-5xl animate-pulse'>
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
		</h2>
		<InProgressLogo />
	</main>
);
