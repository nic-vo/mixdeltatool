'use client';

import { cabin, hind } from '@/styles/fonts';
import Link from 'next/link';
import {
	GlobalButton,
	GlobalMain,
	GlobalTextWrapper,
} from '@/components/global/serverComponentUI';

import '@/styles/globals.css';

const GlobalError = ({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => {};
}) => {
	return (
		<html lang='en'>
			<body
				className={`${hind.className} bg-black text-white flex flex-col items-center h-screen justify-between overflow-hidden`}>
				<GlobalMain>
					<h1 className={cabin.className + ' text-5xl'}>
						Something went wrong.
					</h1>
					<GlobalButton onClick={reset}>
						<GlobalTextWrapper>Click here to reset</GlobalTextWrapper>
					</GlobalButton>
					<Link
						href='/'
						prefetch={false}>
						Or click here to return home.
					</Link>
				</GlobalMain>
			</body>
		</html>
	);
};

export default GlobalError;
