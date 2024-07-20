'use client';

import { forwardRef, useEffect, useRef } from 'react';
import {
	clearDiffer,
	clearTarget,
	setAction,
	setDiffer,
	setTarget,
} from '@/state/differFormSlice';

import {
	toggleKeepImg,
	updateDesc,
	updateName,
} from '@/state/differOptionalFormSlice';

import {
	AppDispatch,
	selectDifferFetch,
	selectDifferForm,
	selectDifferOptionalForm,
	selectSpecificPlaylists,
	selectUserPlaylists,
} from '@/state';
import { useDispatch, useSelector } from 'react-redux';
import { CLIENT_DIFF_TYPES } from '@/consts/spotify';
import ListItem from '../../_components/ListItem';
import {
	GlobalButton,
	GlobalTextWrapper,
} from '@/components/global/serverComponentUI';

import { ActionType } from '@/types/spotify';
import type {
	Dispatch,
	LabelHTMLAttributes,
	PropsWithChildren,
	SelectHTMLAttributes,
	SetStateAction,
} from 'react';
import {
	flippedSlider,
	hitsSpotify,
	localNavigation,
} from '@/consts/buttonStates';

type StageProps = PropsWithChildren & {
	changeStage: Dispatch<SetStateAction<number>>;
};

export const TargetSelector = (props: StageProps) => {
	const dispatch = useDispatch<AppDispatch>();
	const userPlaylists = useSelector(selectUserPlaylists);
	const specificPlaylists = useSelector(selectSpecificPlaylists);
	const { target } = useSelector(selectDifferForm);
	const focusRef = useRef<HTMLLabelElement>(null);

	useEffect(() => {
		if (focusRef.current) focusRef.current.focus();
	}, []);

	const targetChangeHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const id = e.target.value;
		if (id === '') {
			dispatch(clearTarget());
			return;
		}
		const userMap = new Map();
		for (const playlist of userPlaylists) userMap.set(playlist.id, playlist);
		const specificMap = new Map();
		for (const playlist of specificPlaylists)
			specificMap.set(playlist.id, playlist);
		if (userMap.has(id)) dispatch(setTarget(userMap.get(id)));
		else if (specificMap.has(id)) dispatch(setTarget(specificMap.get(id)));
		return;
	};

	return (
		<>
			<MixerLabel
				htmlFor='target'
				ref={focusRef}>
				<GlobalTextWrapper className='shrink-0'>
					What playlist do you want to change?
				</GlobalTextWrapper>
				<MixerSelect
					autoComplete='off'
					required
					id='target'
					value={target !== '' ? target.id : ''}
					onChange={targetChangeHandler}>
					{props.children}
				</MixerSelect>
			</MixerLabel>
			<section
				aria-live='polite'
				className='min-h-16 flex flex-col gap-4 items-center justify-center'>
				<h2
					className={`text-2xl font-bold font-hind ${
						target !== '' ? 'text-white' : 'text-slate-500'
					}`}>
					{target !== '' ? 'You have chosen:' : 'Nothing selected...'}
				</h2>
				{target !== '' && (
					<SelectedPreview>
						<ListItem playlist={target} />
						<NextButton changeStage={props.changeStage} />
					</SelectedPreview>
				)}
			</section>
		</>
	);
};

export const DifferSelector = (props: StageProps) => {
	const dispatch = useDispatch<AppDispatch>();
	const userPlaylists = useSelector(selectUserPlaylists);
	const specificPlaylists = useSelector(selectSpecificPlaylists);
	const { differ } = useSelector(selectDifferForm);
	const focusRef = useRef<HTMLLabelElement>(null);

	useEffect(() => {
		if (focusRef.current) focusRef.current.focus();
	}, []);

	const differChangeHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const id = e.target.value;
		if (id === '') {
			dispatch(clearDiffer());
			return null;
		}
		const userMap = new Map();
		for (const playlist of userPlaylists) userMap.set(playlist.id, playlist);
		const specificMap = new Map();
		for (const playlist of specificPlaylists)
			specificMap.set(playlist.id, playlist);
		if (userMap.has(id)) dispatch(setDiffer(userMap.get(id)));
		else if (specificMap.has(id)) dispatch(setDiffer(specificMap.get(id)));
		return null;
	};

	return (
		<>
			<MixerLabel
				htmlFor='differ'
				ref={focusRef}>
				<GlobalTextWrapper className='shrink-0'>
					What playlist do you want to compare it to?
				</GlobalTextWrapper>
				<MixerSelect
					autoComplete='off'
					required
					id='differ'
					value={differ !== '' ? differ.id : ''}
					onChange={differChangeHandler}>
					{props.children}
				</MixerSelect>
			</MixerLabel>
			<section
				aria-live='polite'
				className='min-h-16 flex flex-col gap-4 items-center justify-center'>
				<h2
					className={`text-2xl font-bold font-hind ${
						differ !== '' ? 'text-white' : 'text-slate-500'
					}`}>
					{differ !== '' ? 'You have chosen:' : 'Nothing selected...'}
				</h2>
				{differ !== '' && (
					<SelectedPreview>
						<ListItem playlist={differ} />
						<PrevButton changeStage={props.changeStage} />
						<NextButton changeStage={props.changeStage} />
					</SelectedPreview>
				)}
			</section>
		</>
	);
};

export const ActionSelector = (props: StageProps) => {
	const dispatch = useDispatch<AppDispatch>();
	const { action } = useSelector(selectDifferForm);
	const { newName, newDesc, keepImg } = useSelector(selectDifferOptionalForm);
	const focusRef = useRef<HTMLLabelElement>(null);

	useEffect(() => {
		if (focusRef.current) focusRef.current.focus();
	}, []);

	const newNameHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
		dispatch(updateName(e.target.value));
		return null;
	};

	const newDescHandler = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		dispatch(updateDesc(e.target.value));
		return null;
	};

	const actionHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const newval = e.target.value as ActionType | '';
		dispatch(setAction(newval));
		return null;
	};

	return (
		<>
			<MixerLabel
				htmlFor='actionType'
				ref={focusRef}>
				<GlobalTextWrapper className='shrink-0'>
					The result will contain:
				</GlobalTextWrapper>
				<MixerSelect
					autoComplete='off'
					required
					id='actionType'
					value={action}
					onChange={actionHandler}>
					<option value={''}>Choose one...</option>
					{Object.entries(CLIENT_DIFF_TYPES).map((pair) => {
						return (
							<option
								value={pair[0]}
								key={pair[0]}>
								{pair[1]}
							</option>
						);
					})}
				</MixerSelect>
			</MixerLabel>
			<MixerLabel htmlFor='name'>
				<GlobalTextWrapper className='shrink-0'>
					Rename playlist?
				</GlobalTextWrapper>
				<input
					id='name'
					type='text'
					value={newName}
					onChange={newNameHandler}
					autoComplete='off'
					maxLength={30}
					className='bg-transparent p-2 text-white focus:text-black focus:bg-white transition-all outline-none border-b-2 border-slate-500 focus:border-white w-full'
				/>
			</MixerLabel>
			<MixerLabel htmlFor='desc'>
				<GlobalTextWrapper className='shrink-0'>
					New playlist description?
				</GlobalTextWrapper>
				<textarea
					id='desc'
					value={newDesc}
					onChange={newDescHandler}
					autoComplete='off'
					maxLength={120}
					className='w-full bg-transparent rounded-xl border-slate-500 focus:border-white transition-all border-2 p-2 outline-none h-32'
				/>
			</MixerLabel>
			<label
				htmlFor='keepImg'
				className='w-max self-center flex gap-2 items-center'>
				<GlobalTextWrapper>
					Attempt to keep playlist thumbnail?
				</GlobalTextWrapper>
				<input
					type='checkbox'
					id='keepImg'
					onChange={() => dispatch(toggleKeepImg())}
					checked={keepImg}
				/>
			</label>
			{action !== '' && (
				<SelectedPreview empty>
					<PrevButton changeStage={props.changeStage} />
					<NextButton changeStage={props.changeStage} />
				</SelectedPreview>
			)}
		</>
	);
};

export const ReviewAndSubmit = (props: Pick<StageProps, 'changeStage'>) => {
	const { target, differ, action } = useSelector(selectDifferForm);
	const { newName, newDesc, keepImg } = useSelector(selectDifferOptionalForm);
	const { loading } = useSelector(selectDifferFetch);
	const focusRef = useRef<HTMLLabelElement>(null);

	useEffect(() => {
		if (focusRef.current) focusRef.current.focus();
	}, []);

	return (
		<>
			<div className='flex flex-col items-center gap-2'>
				{target !== '' ? (
					<ListItem playlist={target} />
				) : (
					<p className='text-slate-500'>No target...</p>
				)}
			</div>
			<div className='flex flex-col items-center gap-2'>
				{differ !== '' ? (
					<ListItem playlist={differ} />
				) : (
					<p className='text-slate-500'>No differ...</p>
				)}
			</div>
			{action !== '' ? (
				<p className='text-center'>
					{CLIENT_DIFF_TYPES[action].replace(/.$/, ' will remain.')}
				</p>
			) : (
				<p className='text-center text-slate-500'>No action...</p>
			)}
			<ul className='relative flex gap-x-8 gap-y-4 flex-wrap justify-center items-center list-disc'>
				<li>
					<p className='block max-w-64 text-nowrap overflow-hidden text-ellipsis'>
						<strong className='text-myteal'>New name:</strong>{' '}
						{newName !== '' ? newName : 'n/a'}
					</p>
				</li>
				<li>
					<p className='block max-w-64 text-nowrap overflow-hidden text-ellipsis '>
						<strong className='text-satorange'>New description:</strong>{' '}
						{newDesc !== '' ? newDesc.substring(0, 20) : 'n/a'}
					</p>
				</li>
				<li>
					<p className='block text-nowrap text-ellipsis'>
						<strong className='text-pinkred'>Keep original thumbnail:</strong>{' '}
						{keepImg ? 'Yes' : 'No'}
					</p>
				</li>
			</ul>
			<SelectedPreview empty>
				<PrevButton changeStage={props.changeStage} />
				<GlobalButton
					disabled={loading || target === '' || differ === '' || action === ''}
					type='submit'
					className={
						'!border-green-500 text-green-500 ' +
						hitsSpotify +
						' ' +
						'w-max place-self-end'
					}>
					<GlobalTextWrapper>Create a new playlist!</GlobalTextWrapper>
				</GlobalButton>
			</SelectedPreview>
		</>
	);
};

const SelectedPreview = (props: PropsWithChildren & { empty?: boolean }) => (
	<div
		className={`w-full grid grid-cols-2 gap-y-4${
			!props.empty ? ' first:*:col-span-full' : ''
		}`}>
		{props.children}
	</div>
);

const PrevButton = (props: StageProps & { className?: string }) => (
	<GlobalButton
		onClick={() => props.changeStage((prev) => prev - 1)}
		className={`${localNavigation} ${flippedSlider} col-start-1 place-self-start${
			props.className ? ` ${props.className}` : ''
		}`}
		type='button'>
		<GlobalTextWrapper>Back</GlobalTextWrapper>
	</GlobalButton>
);

const NextButton = (props: StageProps & { className?: string }) => (
	<GlobalButton
		onClick={() => props.changeStage((prev) => prev + 1)}
		className={`${localNavigation} col-start-2 place-self-end w-max${
			props.className ? ` ${props.className}` : ''
		}`}
		type='button'>
		<GlobalTextWrapper>Next</GlobalTextWrapper>
	</GlobalButton>
);

const MixerSelect = (
	props: PropsWithChildren &
		Omit<SelectHTMLAttributes<HTMLSelectElement>, 'className'>
) => (
	<select
		{...props}
		className='p-2 rounded-full w-full bg-transparent border-slate-500 border-2 focus:border-white outline-none cursor-pointer'>
		{props.children}
	</select>
);

type LabelProps = PropsWithChildren & LabelHTMLAttributes<HTMLLabelElement>;

const MixerLabel = forwardRef<HTMLLabelElement, LabelProps>(
	function InternalMixerLabel(props: LabelProps, ref) {
		return (
			<label
				{...props}
				ref={ref}
				className={`w-full flex flex-col gap-2 items-center${
					props.className ? ` ${props.className}` : ''
				}`}>
				{props.children}
			</label>
		);
	}
);
