'use client';

import { PropsWithChildren, useEffect, useState } from 'react';
import { sanitize } from 'isomorphic-dompurify';
import {
	GlobalButton,
	GlobalTextWrapper,
} from '@/components/global/serverComponentUI';
import { hitsSpotify } from '@/consts/buttonStates';

export const HCaptchaBlock = () => {
	const [loaded, setLoaded] = useState(false);
	const [error, setError] = useState(false);
	useEffect(() => {
		if (!process.env.NEXT_PUBLIC_HCAPTCHA_SITEKEY) {
			setError(true);
			return;
		}
		const timeout = setTimeout(() => {
			if (window.hcaptcha) return;
			clearInterval(interval);
			setError(true);
		}, 5000);
		const interval = setInterval(() => {
			if (!window.hcaptcha) {
				return;
			}
			clearInterval(interval);
			clearTimeout(timeout);
			setLoaded(true);
			return;
		}, 250);
		return () => {
			clearTimeout(timeout);
			clearInterval(interval);
		};
	}, []);

	useEffect(() => {
		if (!process.env.NEXT_PUBLIC_HCAPTCHA_SITEKEY) {
			setError(true);
			return;
		}
		if (!loaded) return;
		window.hcaptcha.render('h-captcha', {
			sitekey: process.env.NEXT_PUBLIC_HCAPTCHA_SITEKEY,
		});
		return;
	}, [loaded]);

	if (error) return <p>There was an error loading hCaptcha. Please refresh.</p>;
	if (!loaded) return <p>Loading...</p>;
	return (
		<>
			<div
				className='h-captcha'
				data-sitekey={process.env.NEXT_PUBLIC_HCAPTCHA_SITEKEY}
				id='h-captcha'
				data-theme='dark'
			/>
			<GlobalButton
				type='submit'
				className={hitsSpotify}>
				<GlobalTextWrapper>Submit</GlobalTextWrapper>
			</GlobalButton>
		</>
	);
};

export default function ContactForm(props: PropsWithChildren) {
	const [error, setError] = useState<true | string | null>(null);
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
		} catch (e: any) {
			if (e.status === 403) {
				setError(true);
			} else {
				window.hcaptcha.reset();
				setError((e.message as string) || 'Unknown error');
			}
		}
		setLoading(false);
	};

	return (
		<form
			className='flex flex-col items-center gap-8 p-4 w-full max-w-prose overflow-y-auto'
			onSubmit={submitHandler}>
			<fieldset
				disabled={loading || success === true || error === true}
				className='flex flex-col items-center gap-8 p-4 w-full'>
				<label
					htmlFor='name'
					className='flex flex-col sm:flex-row gap-4 w-full items-center'>
					<span className='block text-xl font-bold text-right shrink-0'>
						Your name:
					</span>
					<input
						id='name'
						name='name'
						type='text'
						required={true}
						pattern="^(\w|d\|-|'| ){3,30}$"
						autoComplete='off'
						minLength={3}
						maxLength={30}
						className='w-full text-base font-normal col-span-3 resize-none text-white p-2 cursor-text bg-transparent border-2 border-transparent border-b-slate-500 focus-visible:border-white transition-colors outline-none '
					/>
				</label>
				<label
					htmlFor='message'
					className='flex flex-col sm:flex-row gap-4 w-full items-center'>
					<span className='block text-xl font-bolds shrink w-max'>
						Message:
					</span>
					<textarea
						id='message'
						name='message'
						minLength={3}
						maxLength={280}
						required={true}
						className='w-full text-base font-normal col-span-3 resize-none text-white p-2 cursor-text h-32 rounded-xl bg-transparent outline-none border transition-all border-slate-500 focus-visible:border-white grow'
					/>
				</label>
				{props.children}
			</fieldset>
			<div
				role='status'
				aria-live='assertive'
				aria-busy={loading}>
				{loading && (
					<p aria-label='Contact form status notification'>Loading...</p>
				)}
				{success === true && (
					<p aria-label='Contact form status notification'>
						Thank you for your feedback!
					</p>
				)}
				{error && <p aria-label='Contact form status notification'>{error}</p>}
			</div>
		</form>
	);
}
