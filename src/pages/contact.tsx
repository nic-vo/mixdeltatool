import { useState } from 'react';
import Head from 'next/head';
import Script from 'next/script';
import { FaAngleDoubleLeft, FaAngleDoubleRight } from 'react-icons/fa';
import { sanitize } from 'isomorphic-dompurify';

import local from '@/styles/contact.module.scss';
import form from '@/components/spotify/dynamic/playlistDiffer/differForm/DifferForm.module.scss';
import global from '@/styles/globals.module.scss';

const Contact = () => {
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
		<>
			<Head>
				<title>Contact Us!</title>
				<meta
					name='description'
					content='The MixDelta contact form'
				/>
			</Head>

			<main className={local.main}>
				<h1 className={local.h1}>Contact us!</h1>
				<p>
					You can contact us via this form or by emailing{' '}
					<a
						href='mailto:mixdeltatool@gmail.com'
						target='_blank'>
						mixdeltatool@gmail.com
					</a>
					.
				</p>
				<form
					className={form.form}
					onSubmit={submitHandler}>
					<label
						htmlFor='name'
						className={form.label}>
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
						/>
					</label>
					<label
						htmlFor='message'
						className={form.label}>
						Message:
						<textarea
							id='message'
							name='message'
							minLength={3}
							maxLength={280}
							required={true}
						/>
					</label>
					{!fullDisabled && success !== true && (
						<>
							<div
								className='h-captcha'
								data-sitekey={process.env.NEXT_PUBLIC_HCAPTCHA_SITEKEY}
								data-theme='dark'
							/>
							<button
								disabled={loading}
								type='submit'
								className={global.emptyButton}>
								Submit
							</button>
						</>
					)}
					<Script src='https://js.hcaptcha.com/1/api.js' />
					{success === true && <p>Thank you!</p>}
					{error && <p>{error}</p>}
				</form>
				<nav className={local.smallnav}>
					<a href='/'>
						<FaAngleDoubleLeft />
						Back home
					</a>
					<a href='/spotify'>
						To the tool <FaAngleDoubleRight />
					</a>
				</nav>
			</main>
		</>
	);
};

export default Contact;
