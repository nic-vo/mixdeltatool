'use client';

import { useState } from 'react';
import { sanitize } from 'isomorphic-dompurify';
import Script from 'next/script';
import { GlobalButton } from '@/components/global';

export default function ContactForm() {
	const [fullDisabled, setFullDisabled] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState<boolean | null>(null);

	const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setLoading(true);
		setSuccess(false);
		setError(null);
		try {
			const data = new FormData(e.target as HTMLFormElement);
			let toReplace = Object.fromEntries(data.entries());
			toReplace.name = sanitize(toReplace.name as string);
			toReplace.message = sanitize(toReplace.message as string);
			const raw = await fetch('/api/contact', {
				method: 'POST',
				body: JSON.stringify(toReplace),
			});
			if (!raw.ok) {
				const jsoned = await raw.json();
				const { message } = jsoned;
				throw { status: raw.status, message };
			}
			setSuccess(true);
			setFullDisabled(true);
		} catch (e: any) {
			if (e.status === 403) {
				setFullDisabled(true);
			} else window.hcaptcha.reset && window.hcaptcha.reset();
			setError((e.message as string) || 'Unknown error');
		}
		setLoading(false);
	};

	return (
		<form
			className='flex flex-col items-center gap-8 p-4 w-full bg-stone-900 bg-opacity-40 justify-self-center self-center max-w-screen-sm rounded-2xl overflow-y-auto'
			onSubmit={submitHandler}>
			<label
				htmlFor='name'
				className='flex gap-2 text-2xl w-full font-bold'>
				Your name:
				<input
					id='name'
					name='name'
					type='text'
					required={true}
					pattern="^(\w|d\|-|'| ){3,30}$"
					autoComplete='off'
					minLength={3}
					maxLength={30}
					className='resize-none text-black p-2 cursor-text'
				/>
			</label>
			<label
				htmlFor='message'
				className='flex gap-2 text-2xl w-full font-bold'>
				Message:
				<textarea
					id='message'
					name='message'
					minLength={3}
					maxLength={280}
					required={true}
					className='resize-none text-black p-2 cursor-text h-32'
				/>
			</label>
			{!fullDisabled && success !== true && (
				<>
					<div
						className='h-captcha'
						data-sitekey={process.env.NEXT_PUBLIC_HCAPTCHA_SITEKEY}
						data-theme='dark'
					/>
					<GlobalButton
						disabled={loading}
						type='submit'>
						Submit
					</GlobalButton>
				</>
			)}
			<Script src='https://js.hcaptcha.com/1/api.js' />
			{success === true && <p role='status'>Thank you!</p>}
			{error && <p role='status'>{error}</p>}
		</form>
	);
}
