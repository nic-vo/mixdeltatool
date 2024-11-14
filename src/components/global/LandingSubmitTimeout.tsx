'use client';

import {
	type ButtonHTMLAttributes,
	type PropsWithChildren,
	MouseEvent,
} from 'react';
import { GlobalButton } from '@/components/global/serverComponentUI';
import InProgressLogo from '@/components/global/InProgressLogo';
import useButtonTimeout from '@/components/global/ButtonTimeoutHook';

type TimeoutClickHandler = (
	e: MouseEvent<HTMLButtonElement>
) => void | Promise<void>;

const TimeoutSubmit = ({
	children,
	id,
	...attrs
}: PropsWithChildren &
	Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'disabled' | 'onClick'> & {
		onClick?: TimeoutClickHandler;
	}) => {
	const { message, disabled, clickHandler } = useButtonTimeout(
		'Servers under load...',
		'Try again.'
	);
	return (
		<div className='relative flex flex-col gap-4 items-center w-max px-4'>
			<GlobalButton
				{...attrs}
				id={id}
				onClick={clickHandler}
				aria-controls={`${id}-notification`}
				disabled={disabled}>
				{children}
			</GlobalButton>
			<div
				className='absolute flex gap-2 justify-center items-center right-0 top-1/2 translate-x-full -translate-y-1/2'
				role='status'
				id={`${id}-notification`}>
				{disabled && (
					<InProgressLogo
						aria-hidden
						twSize='size-16'
					/>
				)}

				{!disabled ? (
					<></>
				) : message === '' ? (
					<p className='sr-only'>Working...</p>
				) : (
					<p className='text-nowrap animate-pulse'>{message}</p>
				)}
			</div>
		</div>
	);
};

export default TimeoutSubmit;
