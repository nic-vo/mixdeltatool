import Link from 'next/link';

const NotFound = () => {
	return (
		<div className='relative z-10 h-screen w-full flex flex-col items-center justify-center gap-8'>
			<h2 className='font-cabin text-7xl text-center w-10/12'>
				We couldn&apos;t find what you&apos;re looking for.
			</h2>
			<Link
				href='/'
				className='p-8 text-3xl font-thin'>
				&larr; Return home
			</Link>
		</div>
	);
};

export default NotFound;
