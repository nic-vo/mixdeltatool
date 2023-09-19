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
import { MyPlaylistObject } from '@components/spotify/types';
import { differTypesAndStrings } from '@consts/spotify';

const radioArr = Object.keys(differTypesAndStrings);

type typeState = 'adu' | 'odu' | 'otu' | 'bu' | 'stu';

export default function DifferForm(props: { children: React.ReactNode }) {
	const [target, setTarget] = useState<string | ''>('');
	const [differ, setDiffer] = useState<string | ''>('');
	const [type, setType] = useState<typeState>('adu');
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<true | null>(null);

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
		console.log('re-calculate user differ memo');
		const map = new Map();
		for (const playlist of userPlaylists)
			map.set(playlist.id, playlist);
		return map;
	}, [userPlaylists]);

	const specificMap = useMemo(() => {
		if (specificPlaylists === null) return null;
		console.log('re-calculate specific differ memo');
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
		setTarget(e.target.value);
		return null;
	};

	const differChangeHandler = (e: ChangeEvent<HTMLSelectElement>) => {
		setDiffer(e.target.value);
		return null;
	};

	const radioHandler = (e: ChangeEvent<HTMLInputElement>) => {
		const newval = e.target.value as typeState;
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
		try {
			const raw = await fetch('/api/spotify/createDiffPlaylist', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					target,
					differ,
					type
				})
			});
			if (raw.status === 401) signIn();
			if (raw.ok === false) {
				const jsoned = await raw.json();
				throw jsoned.error as string;
			};
			const jsoned = await raw.json() as MyPlaylistObject;
			updateUserPlaylistsHandler(jsoned);
			setSuccess(true);
		} catch (e: any) {
			setError((typeof (e.error) === 'string' && e.error) || 'Unknown error');
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
						value={target}
						onChange={targetChangeHandler}>
						<option value=''>Choose one</option>
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
						value={differ}
						onChange={differChangeHandler}>
						<option value=''>Choose one</option>
						{props.children}
					</select>
				</label>
				<fieldset style={{ display: 'flex', flexDirection: 'column' }}>
					<legend>What do you want to do to the target?</legend>
					{
						Object.entries(differTypesAndStrings).map((pair) => {
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
					disabled={userLoading || specificLoading}
					type='submit'>Change it!</button>
			</form>
			<section>
				<h3>Output</h3>
				<p>
					{type !== null && differTypesAndStrings[type]}
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
									userMap?.has(target)
									&& (<PlaylistSingle playlist={userMap.get(target)} />)
								)
								|| (
									specificMap?.has(target)
									&& (<PlaylistSingle playlist={specificMap.get(target)} />)
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
									userMap?.has(differ)
									&& (<PlaylistSingle playlist={userMap.get(differ)} />)
								)
								|| (specificMap?.has(differ)
									&& (<PlaylistSingle playlist={specificMap.get(differ)} />)
								)
							}
						</section>
					)
				}
			</section>
		</section >
	);
};
