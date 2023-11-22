import PlaylistSingle from './PlaylistSingle/PlaylistSingle';
import { UserPlaylistContext } from '../../contexts/UserPlaylistProvider';
import { SpecificPlaylistContext } from '../../contexts/SpecificPlaylistProvider';
import {
	useState,
	useContext,
	ChangeEvent,
	useEffect,
	useMemo
} from 'react';
import { signIn } from 'next-auth/react';

import { CLIENT_DIFF_TYPES } from '@consts/spotify';

import { MyPlaylistObject, ActionType, differRouteResponse } from '@components/spotify/types';

import look from './DifferForm.module.scss';

const radioArr = Object.keys(CLIENT_DIFF_TYPES);

export default function DifferForm(props: { children: React.ReactNode }) {
	const [target, setTarget] = useState<MyPlaylistObject | ''>('');
	const [differ, setDiffer] = useState<MyPlaylistObject | ''>('');
	const [type, setType] = useState<ActionType>('adu');
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<successState | null>(null);

	const {
		userPlaylists,
		userLoading,
		updateUserPlaylistsHandler
	} = useContext(UserPlaylistContext);
	const {
		specificPlaylists,
		specificLoading
	} = useContext(SpecificPlaylistContext);

	const userMap = useMemo(() => {
		if (userPlaylists === null) return null;
		const map = new Map();
		for (const playlist of userPlaylists)
			map.set(playlist.id, playlist);
		return map;
	}, [userPlaylists]);

	const specificMap = useMemo(() => {
		if (specificPlaylists === null) return null;
		const map = new Map();
		for (const playlist of specificPlaylists)
			map.set(playlist.id, playlist);
		return map;
	}, [specificPlaylists]);

	// Reset form values if playlists change
	useEffect(() => {
		if (target === '' && differ === '') return;
		setTarget('');
		setDiffer('');
	}, [userPlaylists, specificPlaylists]);

	const targetChangeHandler = (e: ChangeEvent<HTMLSelectElement>) => {
		const id = e.target.value;
		if (id === '') {
			setTarget('');
			return null;
		}
		const userMap = new Map();
		if (userPlaylists !== null)
			for (const playlist of userPlaylists)
				userMap.set(playlist.id, playlist);

		const specificMap = new Map();
		if (specificPlaylists !== null)
			for (const playlist of specificPlaylists)
				specificMap.set(playlist.id, playlist);

		if (userMap.has(id)) setTarget(userMap.get(id))
		else if (specificMap.has(id)) setTarget(specificMap.get(id));
		return null;
	};


	const differChangeHandler = (e: ChangeEvent<HTMLSelectElement>) => {
		const id = e.target.value;
		if (id === '') {
			setDiffer('');
			return null;
		}
		const userMap = new Map();
		if (userPlaylists !== null)
			for (const playlist of userPlaylists)
				userMap.set(playlist.id, playlist);

		const specificMap = new Map();
		if (specificPlaylists !== null)
			for (const playlist of specificPlaylists)
				specificMap.set(playlist.id, playlist);

		if (userMap.has(id)) setDiffer(userMap.get(id))
		else if (specificMap.has(id)) setDiffer(specificMap.get(id));
		return null;
	};

	const radioHandler = (e: ChangeEvent<HTMLInputElement>) => {
		const newval = e.target.value as ActionType;
		setType(newval);
		return null;
	};

	const formSubmitHandler = async (e: React.FormEvent) => {
		e.preventDefault();
		if (userLoading === true
			|| specificLoading === true
			|| target === ''
			|| differ === ''
			|| radioArr.includes(type) === false) return null;
		setLoading(true);
		setError(null);
		try {
			const raw = await fetch('/api/spotify/createDiffPlaylist', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					target: {
						id: target.id,
						type: target.type,
						name: target.name,
						owner: target.owner.display_name
					},
					differ: {
						id: differ.id,
						type: differ.type,
						name: differ.name,
						owner: differ.owner.display_name
					},
					type: type
				})
			});
			if (raw.status === 401) signIn();
			if (raw.ok === false) {
				const jsoned = await raw.json();
				throw jsoned.error as string;
			};
			const jsoned = await raw.json() as differRouteResponse;
			updateUserPlaylistsHandler(jsoned.playlist);
			setSuccess(jsoned.part);
		} catch (e: any) {
			setError(e.message || 'Unknown error');
		};
		setLoading(false);
		return null;
	};

	return (
		<section>
			<h2>Diff a playlist!</h2>
			<form onSubmit={formSubmitHandler}>
				<label htmlFor='target'>
					Target:
					<select
						autoComplete='off'
						required
						name='target'
						id='target'
						value={target !== '' ? target.id : ''}
						onChange={targetChangeHandler}
						className={look.select}>
						{props.children}
					</select>
				</label>
				<label htmlFor='differ'>
					differ:
					<select
						autoComplete='off'
						required
						name='differ'
						id='differ'
						value={differ !== '' ? differ.id : ''}
						onChange={differChangeHandler}
						className={look.select}>
						{props.children}
					</select>
				</label>
				<fieldset style={{ display: 'flex', flexDirection: 'column' }}>
					<legend>What do you want to do to the target?</legend>
					{
						Object.entries(CLIENT_DIFF_TYPES).map((pair) => {
							return (
								<label htmlFor={pair[0]} key={pair[0]}>
									<input
										type='radio'
										name='actionType'
										id={pair[0]}
										value={pair[0]}
										defaultChecked={pair[0] === 'adu'}
										onChange={radioHandler} />
									{pair[1]}
								</label>
							)
						})
					}
				</fieldset>
				<button
					disabled={userLoading || specificLoading || loading}
					type='submit'>Change it!</button>
			</form>
			<section>
				<h3>Output</h3>
				<section>
					{
						success !== null && (<>
							<h4>Success{
								error === null
									|| (success !== null && success.reasons.length > 0) ?
									'!' : '?'
							}</h4>
							<p>
								{
									error !== null && error
								}
								{
									success === null ? '' : success.reasons.length > 0 ?
										'Partial success' :
										'Total success'
								}
							</p>
							{
								success !== null
								&& success.reasons.length > 0
								&& (
									<figure>
										<figcaption>Reasons</figcaption>
										<ul>
											{
												success.reasons.map(
													(reason, index) =>
														<li key={`reason-${index}`}>{reason}</li>)
											}
										</ul>
									</figure>
								)
							}
						</>)
					}
				</section>

			</section>
			<section>
				<h3>Preview</h3>
				<p>
					{type !== null && CLIENT_DIFF_TYPES[type]}
				</p>
				{
					/*
						Really jank conditional rendering
					*/
					target !== '' && (
						<section>
							<h4>Target</h4>
							{
								(
									userMap?.has(target.id)
									&& (<PlaylistSingle playlist={userMap.get(target.id)} />)
								)
								|| (
									specificMap?.has(target.id)
									&& (<PlaylistSingle playlist={specificMap.get(target.id)} />)
								)
							}
						</section>
					)
				}
				{
					differ !== '' && (
						<section>
							<h4>Differ</h4>
							{
								(
									userMap?.has(differ.id)
									&& (<PlaylistSingle playlist={userMap.get(differ.id)} />)
								)
								|| (specificMap?.has(differ.id)
									&& (<PlaylistSingle playlist={specificMap.get(differ.id)} />)
								)
							}
						</section>
					)
				}
			</section>
		</section >
	);
};
