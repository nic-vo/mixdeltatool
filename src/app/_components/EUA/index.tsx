'use client';

import { FormEventHandler, useEffect, useState, useRef } from 'react';
import EUAContent from './server';
import {
	GlobalButton,
	GlobalTextWrapper,
	InlineLink,
} from '@/components/global/serverComponentUI';
import { hitsSpotify } from '@/consts/buttonStates';

const LOCAL_EXPIRY_KEY = 'MIXDELTA_EUA';
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

	if (accepted !== false) return null; // Only add dialog to DOM if accepted is strictly false
	return (
		<dialog
			ref={dialogRef}
			className='w-11/12 h-[90dvh] max-w-prose max-h-[800px] m-auto overflow-hidden rounded-xl bg-white text-black backdrop:backdrop-brightness-[0.2] outline-offset-8 focus-visible:outline outline-white font-hind'>
			<section className='flex flex-col items-center gap-4 p-4 py-8 h-full overflow-hidden '>
				<h1 className='text-3xl sm:text-5xl text-center font-black'>
					MixDelta End User Agreement
				</h1>
				<EUAContent
					styling='gap-8 p-4 md:p-8 overflow-y-auto bg-slate-300 rounded-xl outline-black focus:outline'
					light
					tabIndex={0}
				/>
				<p className='text-center'>
					You must also read and agree to MixDelta&apos;s{' '}
					<InlineLink
						href='/privacypolicy'
						className='outline-black'>
						privacy policy.
					</InlineLink>
				</p>
				<form
					onSubmit={formSubmit}
					className='flex flex-col items-center p-4 gap-4 h-full'>
					<label
						htmlFor='check'
						className='cursor-pointer flex gap-4 max-w-prose items-center'>
						<input
							type='checkbox'
							name='check'
							id='check'
							required
							className='block outline-offset-4 h-max w-max outline-black focus-visible:outline'
						/>
						<span className='block'>
							I have read, understood, and agreed to these terms and conditions
							as well as the terms and conditions set forth by the privacy
							policy.
						</span>
					</label>
					<GlobalButton
						type='submit'
						className={hitsSpotify + ' !border-green-400'}>
						<GlobalTextWrapper>Submit</GlobalTextWrapper>
					</GlobalButton>
				</form>
			</section>
		</dialog>
	);
};

export default SpotEUA;
