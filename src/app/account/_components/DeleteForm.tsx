'use client';

import { signIn, signOut } from 'next-auth/react';
import { useState } from 'react';

import {
	GlobalButton,
	GlobalTextWrapper,
} from '@/components/global/serverComponentUI';

const DeleteForm = () => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<boolean>(false);

	const submitHandler = async (e: React.FormEvent) => {
		e.preventDefault();
		const data = new FormData(e.target as HTMLFormElement);
		if (data.get('confirmation') !== 'mixdelta') {
			setError('Please confirm');
			return;
		}
		setLoading(true);
		setError(null);
		try {
			const res = await fetch('/api/account', { method: 'DELETE' });
			if (res.status === 401) signIn('spotify');
			else if (!res.ok) {
				throw (await res.json()) as { message: string };
			}
			setSuccess(true);
			setTimeout(() => signOut({ callbackUrl: '/', redirect: true }), 3000);
		} catch (e: any) {
			setError(e.message ? e.message : 'Unknown error');
		}
		setLoading(false);
		return;
	};

	return (
		<form
			onSubmit={submitHandler}
			className='flex flex-col items-center gap-4 border-4 border-white p-8 rounded-2xl w-full max-w-prose'>
			<fieldset
				disabled={loading || success}
				className='flex flex-col items-center gap-4 w-full'>
				<label
					htmlFor='confirmation'
					className='w-full flex flex-col gap-2 '>
					<span className='font-hind font-bold'>
						Type &quot;mixdelta&quot; to confirm account deletion.
					</span>
					<input
						name='confirmation'
						id='confirmation'
						type='text'
						required
						autoComplete='off'
						disabled={loading || success}
						pattern='mixdelta'
						className='p-2 border-b-2 bg-transparent transition-all focus-visible:bg-white border-white text-white focus-visible:text-black outline-none disabled:brightness-50 disabled:cursor-not-allowed'
					/>
				</label>
				<GlobalButton type='submit'>
					<GlobalTextWrapper>Initate account deletion</GlobalTextWrapper>
				</GlobalButton>
			</fieldset>
			<div
				role='status'
				aria-live='assertive'
				aria-busy={loading}
				className='min-h-8 flex flex-col justify-center'>
				{error && <p className='text-pinkred'>{error}</p>}
				{loading && <p>pending...</p>}
				{success && (
					<p className='text-green-400'>
						Success! You will be signed out shortly
					</p>
				)}
			</div>
		</form>
	);
};

export default DeleteForm;
