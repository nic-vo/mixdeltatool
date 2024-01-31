import { useContext, useRef, useState } from 'react';
import { SpecificPlaylistContext } from '../../contexts/SpecificPlaylistProvider';
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
	// Ref for non-stateful input
	const fieldRef = useRef<HTMLInputElement | null>(null);

	// Basically dump most of the context here because it requires every bit
	const {
		specificLoading,
		specificError,
		getSpecificPlaylistHandler
	} = useContext(SpecificPlaylistContext);

	const specificPlaylistFormHandler = async (e: React.SyntheticEvent) => {
		// Adapts the UI to the UI-agnostic fetcher from the playlist context
		e.preventDefault();
		const hrefField = fieldRef.current;
		if (hrefField !== null) {
			// Split off the domain and URI beginning, then the weird query
			// Hopefully the <input>'s pattern is broad enough
			// Should accept any playlist/ or album/
			const splitBegin = hrefField.value.split('.com/')[1];
			const type = splitBegin.split('/')[0];
			const id = splitBegin.split('/')[1].split('?si')[0];
			// A bit weird that the logic for handling the error isn't here
			// Possibly anti-pattern; but this UI is purely meant to adapt
			// The handler
			await getSpecificPlaylistHandler({ type, id });
		};
		setHref('');
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
					ref={fieldRef}
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
