'use client';

import { notosans, overpass } from '@/styles/fonts';
import Link from 'next/link';

const GlobalError = ({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => {};
}) => {
	return (
		<html lang='en'>
			<body className='w-full'>
				<div
					className={
						notosans.className +
						' min-h-screen min-w-full flex flex-col items-center gap-8'
					}>
					<h2 className={overpass.className + ' text-5xl'}>
						Something went wrong.
					</h2>
					<button onClick={reset}>Click here to reset</button>
					<Link
						href='/'
						prefetch={false}>
						Or click here to return home.
					</Link>
				</div>
			</body>
		</html>
	);
};

export default GlobalError;
