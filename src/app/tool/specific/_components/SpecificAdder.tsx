'use client';

import { retrieveSpecificAsync } from '@/state/thunks';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, selectSpecificFetch } from '@/state';
import { SmallStatus } from '../../_components/server';
import { IoClose, IoDownload } from 'react-icons/io5';
import {
	GlobalButton,
	GlobalTextWrapper,
} from '@/components/global/serverComponentUI';
import { hitsSpotify } from '@/consts/buttonStates';
import { clearSpecific } from '@/state/specificPlaylistsSlice';

export default function SpecificAdder() {
	const { loading, error } = useSelector(selectSpecificFetch);
	const dispatch = useDispatch<AppDispatch>();

	const submitHandler = (e: React.FormEvent) => {
		e.preventDefault();
		dispatch(
			retrieveSpecificAsync(
				new FormData(e.currentTarget as HTMLFormElement).get('link') as string
			)
		);
	};

	const resetHandler = (e: React.FormEvent) => {
		e.preventDefault();
		dispatch(clearSpecific());
	};

	return (
		<form
			onSubmit={submitHandler}
			onReset={resetHandler}
			className='flex flex-col gap-2'>
			<fieldset
				disabled={loading}
				className='grid grid-cols-2 gap-2 gap-y-4'>
				<label
					htmlFor='link'
					className='col-span-full'>
					<input
						type='text'
						id='link'
						name='link'
						required
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
					className='flex items-center gap-2 py-2 before:!bg-red-500 hover:border-red-500 focus-visible:border-red-500 disabled:border-white'>
					<IoClose
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
