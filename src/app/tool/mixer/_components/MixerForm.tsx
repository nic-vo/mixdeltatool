'use client';

import { PropsWithChildren, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, selectDifferForm } from '@/state';
import {
	DifferSelector,
	ActionSelector,
	TargetSelector,
	ReviewAndSubmit,
} from './stages';

import { differOperationAsync } from '@/state/thunks';
import { IoChevronBack, IoChevronForward } from 'react-icons/io5';
import { GlobalButton } from '@/components/global/serverComponentUI';
import { flippedSlider } from '@/consts/buttonStates';
import { resetToForm } from '@/state/differFormSlice';

export default function MixerForm(props: { children: React.ReactNode }) {
	const [stage, setStage] = useState(0);
	const dispatch = useDispatch<AppDispatch>();

	const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		dispatch(differOperationAsync());
		return;
	};

	const resetHandler = (e: React.FormEvent<HTMLFormElement>) => {
		console.log('resetting');
		e.preventDefault();
		dispatch(resetToForm());
		return;
	};

	const stages = useMemo(
		() => [TargetSelector, DifferSelector, ActionSelector, ReviewAndSubmit],
		[]
	);
	const ActiveComponent = stages[stage];

	return (
		<form
			onSubmit={submitHandler}
			onReset={resetHandler}
			className='w-full max-w-screen-sm flex flex-col gap-8'>
			<menu className='flex justify-center items-center gap-4'>
				<li className='mr-8'>
					<GlobalButton
						onClick={() => setStage(stage - 1)}
						disabled={stage <= 0}
						className={flippedSlider + ' !px-2'}
						type='button'
						aria-label='Previous stage'>
						<IoChevronBack
							aria-hidden
							className='relative block z-10'
						/>
					</GlobalButton>
				</li>
				<li>
					<TargetButton
						onThisStage={stage === 0}
						onClick={() => setStage(0)}>
						<span className='sr-only'>
							Switch to the target selection inputs
						</span>
					</TargetButton>
				</li>
				<li>
					<DifferButton
						onThisStage={stage === 1}
						onClick={() => setStage(1)}>
						<span className='sr-only'>
							Switch to the differ selection inputs
						</span>
					</DifferButton>
				</li>
				<li>
					<ActionButton
						onThisStage={stage === 2}
						onClick={() => setStage(2)}>
						<span className='sr-only'>
							Switch to the action selection inputs
						</span>
					</ActionButton>
				</li>
				<li>
					<ReviewButton
						onThisStage={stage === 3}
						onClick={() => setStage(3)}>
						<span className='sr-only'>
							Switch to the final options, review, and submit inputs
						</span>
					</ReviewButton>
				</li>
				<li className='ml-8'>
					<GlobalButton
						onClick={() => setStage(stage + 1)}
						disabled={stage >= 3}
						className='!px-2'
						type='button'
						aria-label='Previous stage'>
						<IoChevronForward
							aria-hidden
							className='relative block z-10'
						/>
					</GlobalButton>
				</li>
			</menu>
			<fieldset
				aria-label='Multi-stage form inputs'
				aria-live='polite'
				className='flex flex-col gap-8 items-center'>
				<ActiveComponent changeStage={setStage}>
					{props.children}
				</ActiveComponent>
			</fieldset>
		</form>
	);
}

const AnonClasser = (onThisStage: boolean, stageFulfilled: boolean) =>
	`relative flex justify-center items-center size-8 rounded-full border-4 transition-all before:relative before:rounded-full before:size-3/4 ${
		stageFulfilled ? 'before:bg-myteal' : 'before:bg-satorange'
	} ${
		onThisStage ? 'border-white' : 'border-slate-500'
	} outline-white outline-offset-4 focus-visible:outline`;

type AnonProps = PropsWithChildren & {
	onThisStage: boolean;
	onClick: () => void;
};

const TargetButton = ({ children, onThisStage, onClick }: AnonProps) => {
	const { target } = useSelector(selectDifferForm);
	return (
		<button
			className={AnonClasser(onThisStage, target !== '')}
			onClick={onClick}
			type='button'>
			{children}
		</button>
	);
};

const DifferButton = ({ children, onThisStage, onClick }: AnonProps) => {
	const { differ } = useSelector(selectDifferForm);
	return (
		<button
			className={AnonClasser(onThisStage, differ !== '')}
			onClick={onClick}
			type='button'>
			{children}
		</button>
	);
};

const ActionButton = ({ children, onThisStage, onClick }: AnonProps) => {
	const { action } = useSelector(selectDifferForm);
	return (
		<button
			className={AnonClasser(onThisStage, action !== '')}
			onClick={onClick}
			type='button'>
			{children}
		</button>
	);
};

const ReviewButton = ({ children, onThisStage, onClick }: AnonProps) => {
	const { action, differ, target } = useSelector(selectDifferForm);
	return (
		<button
			className={AnonClasser(
				onThisStage,
				action !== '' && differ !== '' && target !== ''
			)}
			onClick={onClick}
			type='button'>
			{children}
		</button>
	);
};
