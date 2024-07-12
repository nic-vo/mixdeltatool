'use client';

import { retrieveSpecificAsync } from '@/state/thunks';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, selectSpecificFetch } from '@/state';
import { AdderForm, SmallStatus } from '../../_components/server';
import { IoClose, IoDownload } from 'react-icons/io5';
import {
	GlobalButton,
	GlobalTextWrapper,
	InlineLink,
} from '@/components/global/serverComponentUI';
import { hitsSpotify } from '@/consts/buttonStates';
import { clearSpecific } from '@/state/specificPlaylistsSlice';
import Image from 'next/image';
import { SpotifyLogo } from '@/consts/spotify';
import { useRef } from 'react';

export default function SpecificAdder() {
	const { loading, error } = useSelector(selectSpecificFetch);
	const dispatch = useDispatch<AppDispatch>();
	const inputRef = useRef<HTMLInputElement>(null);

	const submitHandler = (e: React.FormEvent) => {
		e.preventDefault();
		dispatch(
			retrieveSpecificAsync(
				new FormData(e.currentTarget as HTMLFormElement).get('link') as string
			)
		);
		if (inputRef.current) inputRef.current.value = '';
	};

	const resetHandler = (e: React.FormEvent) => {
		e.preventDefault();
		dispatch(clearSpecific());
	};

	return (
		<AdderForm
			onSubmit={submitHandler}
			onReset={resetHandler}>
			<fieldset
				disabled={loading}
				className='grid grid-cols-2 gap-2 gap-y-4'>
				<label
					htmlFor='link'
					className='flex flex-col gap-2 col-span-full'>
					<span className='font-karla font-light'>
						Paste a playlist or album share link
					</span>
					<input
						autoComplete='off'
						type='text'
						id='link'
						name='link'
						required
						ref={inputRef}
						pattern='(\d|\w){22}(\?si=(\d|\w)*){0,1)$'
						className='transition-all outline-none border-white border w-full bg-transparent focus-visible:bg-white focus-visible:text-black p-2 rounded-xl'
					/>
				</label>
				<GlobalButton
					type='submit'
					className={hitsSpotify + ' flex items-center gap-2 py-2'}>
					<IoDownload
						aria-hidden
						className='relative z-10 block text-2xl'
					/>{' '}
					<GlobalTextWrapper>Retrieve</GlobalTextWrapper>
				</GlobalButton>
				<GlobalButton
					type='reset'
					className='flex items-center gap-2 py-2 after:!bg-red-500 hover:border-red-500 focus-visible:border-red-500 disabled:border-white'>
					<IoClose
						aria-hidden
						className='relative z-10 block text-2xl'
					/>{' '}
					<GlobalTextWrapper>Clear</GlobalTextWrapper>
				</GlobalButton>
				<SmallStatus
					error={error}
					loading={loading}
				/>
			</fieldset>
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
