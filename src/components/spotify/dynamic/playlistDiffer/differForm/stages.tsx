import { setAction, setDiffer, setTarget } from '@state/differFormSlice';
import {
	AppDispatch,
	selectDifferFetch,
	selectDifferForm,
	selectSpecificPlaylists,
	selectUserPlaylists
} from '@state/state';
import { useDispatch, useSelector } from 'react-redux';

import local from './DifferForm.module.scss';
import global from '@styles/globals.module.scss';
import { FaExclamationCircle } from 'react-icons/fa';
import { CLIENT_DIFF_TYPES } from '@consts/spotify';
import { ActionType } from '@components/spotify/types';
import { ListItem } from '@components/misc';

export const TargetSelector = (props: { children: React.ReactNode }) => {
	const dispatch = useDispatch<AppDispatch>();
	const userPlaylists = useSelector(selectUserPlaylists);
	const specificPlaylists = useSelector(selectSpecificPlaylists);
	const { target } = useSelector(selectDifferForm);

	const targetChangeHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const id = e.target.value;
		if (id === '') {
			dispatch(setTarget(''));
			return null;
		}
		const userMap = new Map();
		for (const playlist of userPlaylists)
			userMap.set(playlist.id, playlist);
		const specificMap = new Map();
		for (const playlist of specificPlaylists)
			specificMap.set(playlist.id, playlist);
		if (userMap.has(id)) dispatch(setTarget(userMap.get(id)));
		else if (specificMap.has(id)) dispatch(setTarget(specificMap.get(id)));
		return null;
	}

	return (
		<label htmlFor='target' className={local.label}>
			Choose the Target playlist:
			<select
				autoComplete='off'
				required
				id='target'
				value={target !== '' ? target.id : ''}
				onChange={targetChangeHandler}
				className={local.select}>
				{props.children}
			</select>
		</label>
	);
}

export const DifferSelector = (props: { children: React.ReactNode }) => {
	const dispatch = useDispatch<AppDispatch>();
	const userPlaylists = useSelector(selectUserPlaylists);
	const specificPlaylists = useSelector(selectSpecificPlaylists);
	const { differ } = useSelector(selectDifferForm);

	const differChangeHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const id = e.target.value;
		if (id === '') {
			dispatch(setDiffer(''));
			return null;
		}
		const userMap = new Map();
		for (const playlist of userPlaylists)
			userMap.set(playlist.id, playlist);
		const specificMap = new Map();
		for (const playlist of specificPlaylists)
			specificMap.set(playlist.id, playlist);
		if (userMap.has(id)) dispatch(setDiffer(userMap.get(id)));
		else if (specificMap.has(id)) dispatch(setDiffer(specificMap.get(id)));
		return null;
	}

	return (
		<label htmlFor='differ' className={local.label}>
			Choose the Differ playlist:
			<select
				autoComplete='off'
				required
				id='differ'
				value={differ !== '' ? differ.id : ''}
				onChange={differChangeHandler}
				className={local.select}>
				{props.children}
			</select>
		</label>
	);
}

export const MiscAndSubmit = () => {
	const dispatch = useDispatch<AppDispatch>();
	const { target, differ, type } = useSelector(selectDifferForm);
	const { loading } = useSelector(selectDifferFetch);

	const actionHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const newval = e.target.value as ActionType | '';
		dispatch(setAction(newval));
		return null;
	};
	return (
		<>
			<label htmlFor='actionType' className={local.label}>
				The result will contain:
				<select
					autoComplete='off'
					required
					id='actionType'
					value={type}
					onChange={actionHandler}
					className={local.select}>
					<option value={''}>Choose one...</option>
					{
						Object.entries(CLIENT_DIFF_TYPES).map(pair => {
							return (
								<option value={pair[0]} key={pair[0]}>{pair[1]}</option>
							);
						})
					}
				</select>
			</label>
			<label htmlFor='name' className={local.label}>
				New playlist name (optional):
				<input
					id='name'
					name='name'
					type='text'
					autoComplete='off'
					maxLength={30} />
			</label>
			<label htmlFor='desc' className={local.label}>
				New playlist description (optional):
				<textarea
					id='desc'
					name='desc'
					autoComplete='off'
					maxLength={120} />
			</label>
			<label htmlFor='keepImg'>
				Try to keep target playlist thumbnail?
				<input
					type='checkbox'
					id='keepImg'
					name='keepImg'
					value='yes'
					checked={true} />
			</label>
			<p className={local.caveat}><FaExclamationCircle /> This tool will never directly change a playlist. It will compare the two selected playlists and create a new one from that comparison.</p>
			<button
				disabled={loading
					|| target === ''
					|| differ === ''
					|| type === ''}
				type='submit'
				className={global.emptyButton}>Create a new playlist!</button>
		</>
	);
}

const lengthComplaint = 'has more than 500 tracks, so it may be truncated.';
const NextButton = (props: { changeStage: () => void }) => {
	return <button
		type='button'
		onClick={props.changeStage}
		className={global.emptyButton}>Next</button>
}

export const TargetPreview = (props: { changeStage: () => void }) => {
	const { target } = useSelector(selectDifferForm);
	return (
		<div className={target === '' ? local.emptyItem : local.warningDiv}>
			{target === '' ? <p>nothing here...</p>
				: (<>
					<ListItem playlist={target} />
					{target.tracks > 500
						&& <p className={local.warning}>
							<FaExclamationCircle />Target {lengthComplaint}
						</p>}
					<NextButton changeStage={props.changeStage} />
				</>)}
		</div>
	);
}

export const DifferPreview = (props: { changeStage: () => void }) => {
	const { differ } = useSelector(selectDifferForm);
	return (
		<div className={differ === '' ? local.emptyItem : local.warningDiv}>
			{differ === '' ? <p>nothing here...</p>
				: (<>
					<ListItem playlist={differ} />
					{differ.tracks > 500
						&& <p className={local.warning}>
							<FaExclamationCircle />Target {lengthComplaint}
						</p>}
					<NextButton changeStage={props.changeStage} />
				</>)}
		</div>
	);
}

export const ActionPreview = (props: { changeStage: () => void }) => {
	const { type } = useSelector(selectDifferForm);
	return (
		<div className={local.emptyItem}>
			{type !== '' && <NextButton changeStage={props.changeStage} />}
		</div>
	);
}

export const WarningDiv = () => {
	const { differ, target } = useSelector(selectDifferForm);
	return (
		<div className={local.warningDiv}>
			{
				(target !== '' && target.tracks > 500)
				&& <p className={local.warning}>
					<FaExclamationCircle />Target {lengthComplaint}
				</p>
			}
			{
				(differ !== '' && differ.tracks > 500)
				&& <p className={local.warning}>
					<FaExclamationCircle />Differ {lengthComplaint}
				</p>
			}
		</div>
	);
}
