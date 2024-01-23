import { signIn, signOut } from 'next-auth/react';
import { useEffect, useRef, useState } from 'react';

import local from './DeleteDialog.module.scss';
import form from '@components/spotify/dynamic/playlistDiffer/differForm/DifferForm.module.scss'
import parent from '../Header.module.scss';
import global from '@styles/globals.module.scss';
import { APP_NAME } from '@consts/spotify';
import { FaExclamationTriangle } from 'react-icons/fa';

const DeleteDialog = () => {
	const [toggle, setToggle] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<boolean>(false);
	const modalRef = useRef<HTMLDialogElement>(null);

	useEffect(() => {
		if (!toggle || modalRef.current === null) return;
		modalRef.current.showModal();
	}, [toggle])

	const submitHandler = async (e: React.FormEvent) => {
		e.preventDefault();
		const data = new FormData(e.target as HTMLFormElement);
		if (data.get('confirmation') !== APP_NAME.toLowerCase()) {
			setError('Try again');
			return null;
		}
		setLoading(true);
		setError(null);
		try {
			const res = await fetch(`/api/account/${process.env.NEXT_PUBLIC_ACCOUNT_ROUTE_OBFUS}`);
			if (res.status === 401) signIn();
			else if (res.ok === false) {
				const { message } = await res.json() as { message: string };
				throw { message };
			};
			setSuccess(true);
			setTimeout(() => signOut({ callbackUrl: '/' }), 3000);
		} catch (e: any) {
			setError(e.message ? e.message : 'Unknown error');
		}
		setLoading(false);
		return null;
	}

	return (
		<>
			{
				toggle && (
					<dialog ref={modalRef} className={local.dialog}>
						<p>This form will delete only your account and session data from {APP_NAME}. It won&apos;t affect any playlists you&apos;ve already created with the tool. After using this tool, visit <a href='https://accounts.spotify.com' target='_blank' style={{ textDecoration: 'underline' }}>accounts.spotify.com</a> to disconnect {APP_NAME} from your Spotify account.</p>
						<form
							onSubmit={submitHandler}
							className={form.form}
							style={{ margin: '1rem auto' }}>
							<label htmlFor='confirmation' className={form.label}>
								To proceed with deletion,
								type &quot;{APP_NAME.toLowerCase()}&quot; and press confirm.
								<input
									name='confirmation'
									id='confirmation'
									type='text'
									required
									autoComplete='off'
									disabled={loading || success === true}
									pattern={APP_NAME.toLowerCase()} />
							</label>
							<button
								type='button'
								disabled={loading || success}
								onClick={() => setToggle(false)}
								className={global.emptyButton}>
								Cancel
							</button>
							<button
								disabled={loading || success}
								type='submit'
								className={global.emptyButton}>
								Confirm
							</button>
							<div className={local.statusContainer}>
								{
									loading ? <p>pending...</p>
										: error !== null ? <p>ERROR: {error}</p>
											: success ? (
												<p>Success! You will be signed out shortly.</p>
											) : <p style={{ color: '#666' }}>waiting...</p>
								}
							</div>
						</form>
					</dialog >)
			}

			<button
				id='delete-account'
				onClick={() => setToggle(true)}
				className={parent.flatButton}>
				<FaExclamationTriangle /> Delete account
			</button>
		</>
	);
}

export default DeleteDialog;
