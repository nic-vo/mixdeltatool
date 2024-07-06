'use client';

import { useEffect } from 'react';
import {
	GlobalBlockLink,
	GlobalMain,
} from '@/components/global/serverComponentUI';

const ToolError = (props: {
	error: Error & { digest?: string };
	reset: () => void;
}) => {
	useEffect(() => {}, []);

	return (
		<GlobalMain>
			<h2 className='font-cabin text-7xl text-center w-10/12'>
				We couldn&apos;t find that.
			</h2>
			<GlobalBlockLink href='/tool'>&larr; Return to the tool</GlobalBlockLink>
		</GlobalMain>
	);
};

export default ToolError;
