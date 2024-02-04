import { useState, useCallback } from 'react';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, selectDifferFetch, selectDifferForm } from '@state/state';
import {
	DifferPreview,
	DifferSelector,
	MiscAndSubmit,
	TargetPreview,
	TargetSelector,
	WarningDiv
} from './stages';

import local from './DifferForm.module.scss';
import global from '@styles/globals.module.scss';
import { differOperationAsync } from '@state/thunks';

export default function DifferForm(props: {
	children: React.ReactNode
}) {
	const [stage, setStage] = useState(0);

	const dispatch = useDispatch<AppDispatch>();
	const { type, target, differ } = useSelector(selectDifferForm);
	const { loading } = useSelector(selectDifferFetch);

	const formHandler = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (loading
			|| target === ''
			|| differ === ''
			|| type === '') return null;

		const form = new FormData(e.target as HTMLFormElement);
		let rawName = form.get('name');
		const newName = typeof (rawName) === 'string' && rawName !== '' ? rawName : null;
		let rawDesc = form.get('desc');
		const newDesc = typeof (rawDesc) === 'string' && rawDesc !== '' ? rawDesc : null;

		dispatch(differOperationAsync({
			newName,
			newDesc,
			target,
			differ,
			type,
			keepImg: form.get('keepImg') !== null
		}));

		return null;
	};

	const dummy = [target, differ, type];
	const progClasser = useCallback((value: typeof target | typeof type) => {
		if (value === '') return [local.progressSeg, local.missing];
		return [
			local.progressSeg,
			typeof (value) === 'string' || value.type === 'playlist' ?
				local.playlist : local.album];
	}, []);

	return (
		<form onSubmit={formHandler} className={local.form}>
			<div className={local.stageControls}>
				<button
					onClick={() => setStage(Math.max(stage - 1, 0))}
					disabled={stage === 0}
					type='button'
					className={global.emptyButton}><FaAngleLeft /></button>
				<div className={local.progressBar}>
					{dummy.map((value, index) => {
						let classer = progClasser(value).join(' ');
						if (index === stage) classer += ` ${local.current}`;
						return <button
							key={`${index}-progress`}
							className={classer}
							type='button'
							onClick={() => setStage(index)}>
							{index === 0 ? 'Target' : index === 1 ? 'Differ' : 'Result'}</button>
					})}
				</div>
				<button onClick={() => setStage(Math.min(stage + 1, 2))}
					disabled={stage === 2}
					type='button'
					className={global.emptyButton}><FaAngleRight /></button>
			</div>
			{
				stage === 0 ? <TargetSelector>{props.children}</TargetSelector>
					: stage === 1 ? <DifferSelector>{props.children}</DifferSelector>
						: <MiscAndSubmit />
			}
			<div className={local.previewContainer}>
				{
					stage === 0 ? <TargetPreview changeStage={() => setStage(stage + 1)} />
						: stage === 1 ? <DifferPreview changeStage={() => setStage(stage + 1)} />
							: <WarningDiv />
				}
			</div>
		</form>
	);
};
