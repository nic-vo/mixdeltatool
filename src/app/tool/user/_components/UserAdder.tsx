'use client';

import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, selectPage, selectUserFetch } from '@/state';
import { retrieveUserListsAsync } from '@/state/thunks';
import { AdderForm, SmallStatus } from '../../_components/server';
import { IoDownload } from 'react-icons/io5';
import {
	GlobalButton,
	GlobalTextWrapper,
} from '@/components/global/serverComponentUI';
import { hitsSpotify } from '@/consts/buttonStates';
import { clearUser } from '@/state/userPlaylistsSlice';
import { useEffect, useRef } from 'react';

export default function UserAdder() {
	const page = useSelector(selectPage);
	const { loading, error } = useSelector(selectUserFetch);
	const dispatch = useDispatch<AppDispatch>();
	const buttonRef = useRef<HTMLButtonElement>(null);

	const submitHandler = (e: React.FormEvent) => {
		e.preventDefault();
		dispatch(retrieveUserListsAsync());
	};

	const resetHandler = (e: React.FormEvent) => {
		e.preventDefault();
		dispatch(clearUser());
	};

	useEffect(() => {
		const label = buttonRef.current;
		if (label) label.focus();
	}, []);

	return (
		<AdderForm
			onSubmit={submitHandler}
			onReset={resetHandler}>
			<fieldset
				disabled={loading}
				className='grid grid-cols-2 gap-2 items-end'>
				<GlobalButton
					type='submit'
					disabled={page === null}
					className={
						hitsSpotify +
						' flex items-center gap-2 px-2 w-full focus:text-black focus:border-green-500 focus:after:translate-x-0'
					}
					autoFocus
					ref={buttonRef}>
					<IoDownload
						aria-hidden
						className='relative z-10 block text-2xl'
					/>{' '}
					<GlobalTextWrapper>
						{page === null ? 'No more!' : 'Retrieve'}
					</GlobalTextWrapper>
				</GlobalButton>
				<GlobalButton
					type='reset'
					className='flex items-center gap-2 after:bg-red-500 hover:border-red-500 focus-visible:border-red-500 hover:text-white focus-visible:text-white h-max'>
					<IoDownload
						aria-hidden
						className='relative z-10 block text-2xl shrink-0'
					/>{' '}
					<GlobalTextWrapper>Clear</GlobalTextWrapper>
				</GlobalButton>
			</fieldset>
			<SmallStatus
				error={error}
				loading={loading}
			/>
		</AdderForm>
	);
}
