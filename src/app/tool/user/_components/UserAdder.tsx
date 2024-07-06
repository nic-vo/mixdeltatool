'use client';

import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, selectPage, selectUserFetch } from '@/state';
import { retrieveUserListsAsync } from '@/state/thunks';
import { SmallStatus } from '../../_components/server';
import { IoDownload } from 'react-icons/io5';
import {
	GlobalButton,
	GlobalTextWrapper,
} from '@/components/global/serverComponentUI';
import { hitsSpotify } from '@/consts/buttonStates';
import { clearUser } from '@/state/userPlaylistsSlice';

export default function UserAdder() {
	const page = useSelector(selectPage);
	const { loading, error } = useSelector(selectUserFetch);
	const dispatch = useDispatch<AppDispatch>();

	const submitHandler = (e: React.FormEvent) => {
		e.preventDefault();
		dispatch(retrieveUserListsAsync());
	};

	const resetHandler = (e: React.FormEvent) => {
		e.preventDefault();
		dispatch(clearUser());
	};

	return (
		<form
			onSubmit={submitHandler}
			onReset={resetHandler}
			className='flex flex-col gap-2'>
			<fieldset
				disabled={loading}
				className='flex gap-2'>
				<GlobalButton
					type='submit'
					disabled={page === null}
					className={hitsSpotify + ' flex items-center gap-2 py-2'}>
					<IoDownload
						aria-hidden
						className='relative z-10 block text-2xl'
					/>{' '}
					<GlobalTextWrapper suppressHydrationWarning>
						{page === null ? 'No more!' : 'Retrieve'}
					</GlobalTextWrapper>
				</GlobalButton>
				<GlobalButton
					type='reset'
					className='flex items-center gap-2 py-2 before:!bg-red-500 hover:border-red-500 focus-visible:border-red-500 disabled:border-white'>
					<IoDownload
						aria-hidden
						className='relative z-10 block text-2xl'
					/>{' '}
					<GlobalTextWrapper>Clear</GlobalTextWrapper>
				</GlobalButton>
			</fieldset>
			<SmallStatus
				error={error}
				loading={loading}
			/>
		</form>
	);
}
