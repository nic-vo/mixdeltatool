'use client';

import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, selectPage, selectUserFetch } from '@/state';
import { retrieveUserListsAsync } from '@/state/thunks';
import { AdderForm, SmallStatus } from '../../_components/server';
import { IoDownload } from 'react-icons/io5';
import {
	GlobalButton,
	GlobalTextWrapper,
	InlineLink,
} from '@/components/global/serverComponentUI';
import { hitsSpotify } from '@/consts/buttonStates';
import { clearUser } from '@/state/userPlaylistsSlice';
import Image from 'next/image';
import { SpotifyLogo } from '@/consts/spotify';

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
		<AdderForm
			onSubmit={submitHandler}
			onReset={resetHandler}>
			<fieldset
				disabled={loading}
				className='flex gap-2'>
				<GlobalButton
					type='submit'
					disabled={page === null}
					className={hitsSpotify + ' flex items-center gap-2 !px-2 w-full'}>
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
					className='flex items-center gap-2 after:!bg-red-500 hover:border-red-500 focus-visible:border-red-500 disabled:border-white shrink'>
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
			<p className='flex items-center gap-2 flex-wrap justify-center'>
				<span className='block relative'>
					All playlist data is provided by{' '}
				</span>
				<InlineLink
					href='https://open.spotify.com'
					target='_blank'>
					<Image
						src={SpotifyLogo}
						alt='Spotify'
						className='h-[71px] w-auto shrink-0'
					/>
				</InlineLink>
			</p>
		</AdderForm>
	);
}
