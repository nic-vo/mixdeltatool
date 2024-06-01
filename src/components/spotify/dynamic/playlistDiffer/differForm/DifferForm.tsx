import { useState } from 'react';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, selectDifferForm } from '@/state/state';
import {
	DifferSelector,
	ActionSelector,
	TargetSelector,
	ReviewAndSubmit,
} from './stages';

import local from './DifferForm.module.scss';
import global from '@/styles/globals.module.scss';
import { differOperationAsync } from '@/state/thunks';

export default function DifferForm(props: { children: React.ReactNode }) {
	const [stage, setStage] = useState(0);

	const dispatch = useDispatch<AppDispatch>();
	const { type, target, differ } = useSelector(selectDifferForm);

	const formHandler = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		dispatch(differOperationAsync());
		return null;
	};

	const dummy = [target, differ, type, 'review'];
	const progClasser = (value: typeof target | typeof type | string) => {
		if (value === '') return [local.progressSeg, local.missing];
		if (value === 'review') {
			const satisfied = dummy.reduce((sum, value) => {
				if (value === '') return sum + 1;
				return sum;
			}, 0);
			switch (satisfied) {
				case 0:
					return [local.progressSeg, local.playlist];
				case 3:
					return [local.progressSeg, local.missing];
				default:
					return [local.progressSeg, local.album];
			}
		}
		return [
			local.progressSeg,
			typeof value === 'string' || value.type === 'playlist'
				? local.playlist
				: local.album,
		];
	};

	return (
		<form
			onSubmit={formHandler}
			className={local.form}>
			<div className={local.stageControls}>
				<button
					onClick={() => setStage(stage - 1)}
					disabled={stage <= 0}
					type='button'
					className={global.emptyButton}>
					<FaAngleLeft />
				</button>
				<div className={local.progressBar}>
					{dummy.map((value, index) => {
						let classer = progClasser(value).join(' ');
						if (index === stage) classer += ` ${local.current}`;
						return (
							<button
								key={`${index}-progress`}
								className={classer}
								type='button'
								onClick={() => setStage(index)}>
								{index === 0
									? 'Target'
									: index === 1
									? 'Differ'
									: index === 2
									? 'Action'
									: 'Review'}
							</button>
						);
					})}
				</div>
				<button
					onClick={() => setStage(stage + 1)}
					disabled={stage >= 3}
					type='button'
					className={global.emptyButton}>
					<FaAngleRight />
				</button>
			</div>
			{stage === 0 ? (
				<TargetSelector changeStage={() => setStage(1)}>
					{props.children}
				</TargetSelector>
			) : stage === 1 ? (
				<DifferSelector changeStage={() => setStage(2)}>
					{props.children}
				</DifferSelector>
			) : stage === 2 ? (
				<ActionSelector changeStage={() => setStage(3)} />
			) : (
				<ReviewAndSubmit />
			)}
		</form>
	);
}
