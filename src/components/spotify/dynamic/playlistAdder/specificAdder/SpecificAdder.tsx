import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectSpecificFetch } from '@state/state';
import { retrieveSpecificAsync } from '@state/thunks';
import { badInput } from '@state/specificFetchStateSlice';
import { SmallStatus } from '@components/misc';

import local from './SpecificAdder.module.scss';
import global from '@styles/globals.module.scss';

/*

This is basically just a UI for adding playlists to the current session;
Should be auth agnostic, that'll be handled in the playlist context object;
Has to adapt the playlist context's specificPlaylistHandler to a <form>
(the handler's logic is input agnostic, blindly takes in a param object)

*/

export default function SpecificAdder() {
	const [href, setHref] = useState<string | ''>('');

	const {
		loading: specificLoading,
		error: specificError
	} = useSelector(selectSpecificFetch);

	const dispatch = useDispatch();

	const getSpecificPlaylistHandler = (args:
		{ type: 'album' | 'playlist', id: string }
	) => {
		dispatch(retrieveSpecificAsync({ ...args }))
		return null;
	}

	const specificPlaylistFormHandler = async (e: React.SyntheticEvent) => {
		e.preventDefault();
		// Split off the domain and URI beginning, then the weird query
		// Hopefully the <input>'s pattern is broad enough
		// Should accept any playlist/ or album/
		try {
			const splitBegin = href.split('.com/')[1];
			if (splitBegin === undefined) throw new Error();
			const type = splitBegin.split('/')[0] as 'album' | 'playlist';
			const id = splitBegin.split('/')[1].split('?si')[0];
			if ((type !== 'album' && type !== 'playlist') || id === undefined) throw new Error();
			console.log(type, id);
			getSpecificPlaylistHandler({ type, id });
			setHref('');
		} catch {
			dispatch(badInput());
		}
		return null;
	};

	const hrefChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
		setHref(e.target.value);
		return null;
	};

	return (
		<>
			<form
				name='getSpecificPlaylist'
				onSubmit={specificPlaylistFormHandler}
				className={local.form}>
				<input
					disabled={specificLoading}
					type='text'
					autoComplete='off'
					pattern='^(https:\/\/\w+.spotify.com\/playlist\/[A-Za-z0-9]{22}\?si=.*)|(https:\/\/\w+.spotify.com\/album\/[A-Za-z0-9]{22}\?si=.*)$'
					required
					placeholder='Playlist/album link here...'
					value={href}
					onChange={hrefChangeHandler}
					className={local.textInput} />
				<button
					type='submit'
					disabled={specificLoading}
					className={global.emptyButton}>Add</button>
			</form>
			<SmallStatus error={specificError} loading={specificLoading} />
		</>
	);
};
