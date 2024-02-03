import { UserPlaylistContext } from '../../contexts/UserPlaylistProvider';
import { SpecificPlaylistContext } from '../../contexts/SpecificPlaylistProvider';
import { useContext, useState, useCallback } from 'react';
import { DifferContext } from '../../contexts/DifferProvider';
import { FaAngleLeft, FaAngleRight, FaExclamationCircle } from 'react-icons/fa';
import { ListItem } from '@components/misc';

import { CLIENT_DIFF_TYPES } from '@consts/spotify';

import local from './DifferForm.module.scss';
import global from '@styles/globals.module.scss';

const lengthComplaint = 'has more than 500 tracks, so it may be truncated.';

export default function DifferForm(props: {
	children: React.ReactNode
}) {
	const [stage, setStage] = useState(0);
	const { target,
		differ,
		loading,
		type,
		targetChangeHandler,
		differChangeHandler,
		radioHandler,
		submitHandler } = useContext(DifferContext);

	const { userLoading } = useContext(UserPlaylistContext);
	const { specificLoading } = useContext(SpecificPlaylistContext);

	const formHandler = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		await submitHandler(e);
	}

	const dummy = [target, differ, type];
	const progClasser = useCallback((value: typeof target | typeof type) => {
		if (value === '') return [local.progressSeg, local.missing];
		return [
			local.progressSeg,
			typeof (value) === 'string' || value.type === 'playlist' ?
				local.playlist : local.album];
	}, []);

	return (
		<>
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
					stage === 0 ? (
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
					)
						: stage === 1 ? (<>
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

						</>)
							: (<>
								<label htmlFor='actionType' className={local.label}>
									The result will contain:
									<select
										autoComplete='off'
										required
										id='actionType'
										value={type}
										onChange={radioHandler}
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
									disabled={userLoading
										|| specificLoading
										|| loading
										|| target === ''
										|| differ === ''
										|| type === ''}
									type='submit'
									className={global.emptyButton}>Create a new playlist!</button>
							</>)}
				<div className={local.previewContainer}>
					{
						stage === 0 ? (
							<div className={target === '' ? local.emptyItem : local.warningDiv}>
								{target === '' ? <p>nothing here...</p>
									: (<>
										<ListItem playlist={target} />
										{target.tracks > 500
											&& <p className={local.warning}>
												<FaExclamationCircle />Target {lengthComplaint}
											</p>}
										<button
											type='button'
											onClick={() => setStage(stage + 1)}
											className={global.emptyButton}>Next</button>
									</>)}
							</div>
						) : stage === 1 ? (
							<div className={differ === '' ? local.emptyItem : local.warningDiv}>
								{differ === '' ? <p>nothing here...</p>
									: (<>
										<ListItem playlist={differ} />
										{differ.tracks > 500
											&& <p className={local.warning}>
												<FaExclamationCircle />Differ {lengthComplaint}
											</p>}
										<button
											type='button'
											onClick={() => setStage(stage + 1)}
											className={global.emptyButton}>Next</button>
									</>)}
							</div>
						) : (
							<>
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
							</>)
					}
				</div>
			</form>
		</>
	);
};
