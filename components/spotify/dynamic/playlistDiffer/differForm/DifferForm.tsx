import PlaylistSingle from './PlaylistSingle/PlaylistSingle';
import { UserPlaylistContext } from '../../UserPlaylistProvider';
import { SpecificPlaylistContext } from '../../SpecificPlaylistProvider';
import {
	useState,
	useContext,
	ChangeEvent,
	useEffect,
	useMemo
} from 'react';

export default function DifferForm(props: { children: React.ReactNode }) {
	const [target, setTarget] = useState<string | ''>('');
	const [differ, setDiffer] = useState<string | ''>('');
	const { userPlaylists } = useContext(UserPlaylistContext);
	const { specificPlaylists } = useContext(SpecificPlaylistContext);

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

	const formSubmitHandler = async (e: React.SyntheticEvent) => {
		e.preventDefault();
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
				<button type='submit'>Change it!</button>
			</form>
			<section>
				<h3>Output</h3>
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
		</section>
	);
}
