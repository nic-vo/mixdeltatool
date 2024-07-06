import { InProgressLogo } from '../misc';

export const GlobalLoading = (props: { display?: string }) => (
	<main
		className='relative z-10 flex flex-col justify-center gap-8 items-center flex-grow'
		aria-busy
		aria-live='polite'>
		<h1 className='font-hind font-light text-center text-5xl animate-pulse'>
			{props.display ? (
				props.display
			) : (
				<>
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
				</>
			)}
		</h1>
		<InProgressLogo />
	</main>
);
