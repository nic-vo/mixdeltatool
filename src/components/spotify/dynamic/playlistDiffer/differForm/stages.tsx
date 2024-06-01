import {
	setAction,
	setDiffer,
	setTarget,
	toggleKeepImg,
	updateDesc,
	updateName,
} from '@/state/differFormSlice';
import {
	AppDispatch,
	selectDifferFetch,
	selectDifferForm,
	selectSpecificPlaylists,
	selectUserPlaylists,
} from '@/state/state';
import { useDispatch, useSelector } from 'react-redux';

import local from './DifferForm.module.scss';
import global from '@/styles/globals.module.scss';
import { FaExclamationCircle } from 'react-icons/fa';
import { CLIENT_DIFF_TYPES } from '@/consts/spotify';
import { ActionType } from '@/components/spotify/types';
import { ListItem } from '@/components/misc';

export const TargetSelector = (props: {
	children: React.ReactNode;
	changeStage: () => void;
}) => {
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
		for (const playlist of userPlaylists) userMap.set(playlist.id, playlist);
		const specificMap = new Map();
		for (const playlist of specificPlaylists)
			specificMap.set(playlist.id, playlist);
		if (userMap.has(id)) dispatch(setTarget(userMap.get(id)));
		else if (specificMap.has(id)) dispatch(setTarget(specificMap.get(id)));
		return null;
	};

	return (
		<>
			<label
				htmlFor='target'
				className={local.label}>
				Pick a Target playlist:
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
			<div className={target === '' ? local.emptyItem : local.warningDiv}>
				{target !== '' && (
					<>
						<ListItem playlist={target} />
						{target.tracks > 500 && (
							<p className={local.warning}>
								<FaExclamationCircle />
								Target {lengthComplaint}
							</p>
						)}
						<NextButton changeStage={props.changeStage} />
					</>
				)}
			</div>
		</>
	);
};

export const DifferSelector = (props: {
	children: React.ReactNode;
	changeStage: () => void;
}) => {
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
			<label
				htmlFor='differ'
				className={local.label}>
				Pick a Differ playlist:
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
			<div className={differ === '' ? local.emptyItem : local.warningDiv}>
				{differ !== '' && (
					<>
						<ListItem playlist={differ} />
						{differ.tracks > 500 && (
							<p className={local.warning}>
								<FaExclamationCircle />
								Differ {lengthComplaint}
							</p>
						)}
						<NextButton changeStage={props.changeStage} />
					</>
				)}
			</div>
		</>
	);
};

export const ActionSelector = (props: { changeStage: () => void }) => {
	const dispatch = useDispatch<AppDispatch>();
	const { type, newName, newDesc, keepImg } = useSelector(selectDifferForm);

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
			<label
				htmlFor='actionType'
				className={local.label}>
				The result will contain:
				<select
					autoComplete='off'
					required
					id='actionType'
					value={type}
					onChange={actionHandler}
					className={local.select}>
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
				</select>
			</label>
			<label
				htmlFor='name'
				className={local.label}>
				Rename playlist?
				<input
					id='name'
					type='text'
					value={newName}
					onChange={newNameHandler}
					autoComplete='off'
					maxLength={30}
				/>
			</label>
			<label
				htmlFor='desc'
				className={local.label}>
				New playlist description?
				<textarea
					id='desc'
					value={newDesc}
					onChange={newDescHandler}
					autoComplete='off'
					maxLength={120}
				/>
			</label>
			<label htmlFor='keepImg'>
				Keep playlist thumbnail?
				<input
					type='checkbox'
					id='keepImg'
					onChange={() => dispatch(toggleKeepImg())}
					checked={keepImg}
				/>
			</label>
			{type !== '' && <NextButton changeStage={props.changeStage} />}
		</>
	);
};

export const ReviewAndSubmit = () => {
	const { target, differ, type } = useSelector(selectDifferForm);
	const { loading } = useSelector(selectDifferFetch);
	const targetLengthCheck = target !== '' && target.tracks > 500;
	const differLengthCheck = differ !== '' && differ.tracks > 500;

	return (
		<>
			<div className={target === '' ? local.emptyItem : local.warningDiv}>
				{target === '' ? (
					<p>nothing here...</p>
				) : (
					<>
						<ListItem playlist={target} />
						{target.tracks > 500 && (
							<p className={local.warning}>
								<FaExclamationCircle />
								Target {lengthComplaint}
							</p>
						)}
					</>
				)}
			</div>
			<div className={type === '' ? local.emptyItem : local.warningDiv}>
				<p>{type && CLIENT_DIFF_TYPES[type].replace(/.$/, ' will remain.')}</p>
			</div>
			<div className={differ === '' ? local.emptyItem : local.warningDiv}>
				{differ === '' ? (
					<p>No differ</p>
				) : (
					<>
						<ListItem playlist={differ} />
						{differ.tracks > 500 && (
							<p className={local.warning}>
								<FaExclamationCircle />
								Differ {lengthComplaint}
							</p>
						)}
					</>
				)}
			</div>
			{(targetLengthCheck || differLengthCheck) && (
				<div className={local.warningDiv}>
					{targetLengthCheck && (
						<p className={local.warning}>
							<FaExclamationCircle />
							Target {lengthComplaint}
						</p>
					)}
					{differLengthCheck && (
						<p className={local.warning}>
							<FaExclamationCircle />
							Differ {lengthComplaint}
						</p>
					)}
				</div>
			)}
			<button
				disabled={loading || target === '' || differ === '' || type === ''}
				type='submit'
				className={global.emptyButton}>
				Create a new playlist!
			</button>
		</>
	);
};

const lengthComplaint = 'has more than 500 tracks, so it may be truncated.';

const NextButton = (props: { changeStage: () => void }) => {
	return (
		<button
			type='button'
			onClick={props.changeStage}
			className={global.emptyButton}>
			Next
		</button>
	);
};
