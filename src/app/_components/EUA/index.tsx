'use client';

import { FormEventHandler, useEffect, useState, useRef } from 'react';
import EUAContent from './server';
import { GlobalButton } from '@/components/global';

const LOCAL_EXPIRY_KEY = 'SUPERUSER_EUA';
const LOCAL_EXPIRY_LENGTH = 1000 * 60 * 60 * 24 * 7;
// const LOCAL_EXPIRY_LENGTH = 1000 * 5;

const SpotEUA = (props: { submitter?: () => void }) => {
	const dialogRef = useRef<HTMLDialogElement>(null);
	const [accepted, setAccepted] = useState<boolean | null>(null);

	useEffect(() => {
		try {
			const local = localStorage.getItem(LOCAL_EXPIRY_KEY);
			if (local === null) throw null;
			const expiry = parseInt(local) * 1000;
			if (expiry === undefined || Date.now() > expiry) throw null;
			if (props.submitter) props.submitter();
			setAccepted(true);
		} catch {
			setAccepted(false);
		}
	}, []);

	useEffect(() => {
		if (accepted === true) return;
		if (dialogRef.current !== null) dialogRef.current.showModal();
	}, [accepted]);

	const formSubmit: FormEventHandler = (e) => {
		e.preventDefault();
		localStorage.setItem(
			LOCAL_EXPIRY_KEY,
			Math.floor((Date.now() + LOCAL_EXPIRY_LENGTH) / 1000).toString()
		);
		if (props.submitter) props.submitter();
		dialogRef.current!.close();
		setAccepted(true);
		return null;
	};

	if (accepted !== false) return null;
	return (
		<dialog
			ref={dialogRef}
			className='bg-black w-11/12 h-[90dvh] max-w-screen-lg max-h-[1024px] m-auto overflow-hidden border-0 rounded-xl backdrop-blur-sm backdrop-brightness-50'>
			<form
				onSubmit={formSubmit}
				className='flex flex-col gap-8 p-4 w-full h-full m-auto overflow-hidden'>
				<h2 className='text-center'>MixDelta End User Agreement</h2>
				<div className='flex flex-col gap p-4 md:p-8 overflow-y-auto bg-transparent backdrop-brightness-150 rounded-xl'>
					<EUAContent />
				</div>
				<p className='text-center'>
					MixDelta&apos;s{' '}
					<a
						href='/privacypolicy'
						className='font-bold underline'>
						privacy policy.
					</a>
				</p>
				<label
					htmlFor='check'
					className='cursor-pointer flex gap-4 py-4'>
					<input
						type='checkbox'
						name='check'
						id='check'
						required
					/>
					I have read, understood, and agreed to these terms and conditions as
					well as the terms and conditions set forth by the privacy policy.
				</label>
				<GlobalButton type='submit'>Submit</GlobalButton>
			</form>
		</dialog>
	);
};

export default SpotEUA;
