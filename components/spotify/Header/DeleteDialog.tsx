import { signIn, signOut } from 'next-auth/react';
import { useRef, useState } from 'react';

import look from './Header.module.scss';

const DeleteDialog = () => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<boolean>(false);
	const modalRef = useRef<HTMLDialogElement>(null);

	const submitHandler = async (e: React.FormEvent) => {
		e.preventDefault();
		const data = new FormData(e.target as HTMLFormElement);
		if (data.get('confirmation') !== 'superusers') {
			setError('Try again');
			return null;
		}
		setLoading(true);
		setError(null);
		try {
			const res = await fetch(`/api/account/${process.env.NEXT_PUBLIC_ACCOUNT_ROUTE_OBFUS}`);
			if (res.status === 401) signIn();
			else if (res.ok === false) throw { message: 'Unknown error' };
			setSuccess(true);
			setTimeout(() => signOut({ callbackUrl: '/' }), 5000);
		} catch (e: any) {
			setError(e.message ? e.message : 'Unknown error');
		}
		setLoading(false);
		return null;
	}

	return (
		<>
			<dialog ref={modalRef} className={look.modal}>
				<form onSubmit={submitHandler}>
					<label htmlFor='confirmation'>
						To confirm account deletion request,
						type "superusers" and hit confirm.
					</label>
					<input
						name='confirmation'
						id='confirmation'
						type='text'
						min='1'
						max='20'
						required
						autoComplete='off'
						disabled={loading || success === true}
						pattern='superusers' />
					{
						loading === false && success !== true && (
							<>
								<button
									type='button'
									disabled={loading}
									onClick={() => modalRef.current!.close()}>
									Cancel
								</button>
								<button
									disabled={loading}
									type='submit'>
									Confirm
								</button>
							</>
						)
					}
					<div className={look.statusContainer}>
						{error !== null && <p>{error}</p>}
						{
							success === true && (
								<>
									<p>Success! You will be signed out shortly.</p>
									<button onClick={() => {
										setSuccess(false);
										setError(null);
										setLoading(false);
										modalRef.current!.close();
									}}>Close</button>
								</>
							)
						}
					</div>
					<p>status: {loading ? 'loading'
						: success ? 'success'
							: error !== null ? error
								: 'idle'}</p>
				</form>
			</dialog>

			<button
				onClick={() => modalRef.current!.showModal()}
				className={look.button}>
				Delete account
			</button>
		</>
	);
}

export default DeleteDialog;
