import { useContext, useEffect, useState } from 'react';
import { UserPlaylistContext } from '@components/spotify/dynamic/contexts/UserPlaylistProvider';
import { SpecificPlaylistContext } from '@components/spotify/dynamic/contexts/SpecificPlaylistProvider';
import { signIn } from 'next-auth/react';
import { sanitize } from 'dompurify';

import { ActionType, MyPlaylistObject, differRouteResponse } from '@components/spotify/types';
import { CLIENT_DIFF_TYPES } from '@consts/spotify';
import { GlobalLoadingContext } from '@components/spotify/dynamic/contexts/GlobalLoadingProvider';

const radioArr = Object.keys(CLIENT_DIFF_TYPES);

const useDifferForm = () => {
	const [target, setTarget] = useState<MyPlaylistObject | ''>('');
	const [differ, setDiffer] = useState<MyPlaylistObject | ''>('');
	const [type, setType] = useState<ActionType | ''>('');
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string[] | null>(null);

	const { gLoading, updateGLoading } = useContext(GlobalLoadingContext);

	const {
		userPlaylists,
		userLoading,
		updateUserPlaylistsHandler
	} = useContext(UserPlaylistContext);
	const {
		specificPlaylists,
		specificLoading
	} = useContext(SpecificPlaylistContext);

	// Reset form values if playlists change
	useEffect(() => {
		const userSet = new Set(userPlaylists.map(list => list.id));
		const specificSet = new Set(specificPlaylists.map(list => list.id));
		if (target !== ''
			&& !userSet.has(target.id)
			&& !specificSet.has(target.id))
			setTarget('');
		else if (differ !== ''
			&& !userSet.has(differ.id)
			&& !specificSet.has(differ.id))
			setDiffer('');
	}, [userPlaylists, specificPlaylists]);

	const targetChangeHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const id = e.target.value;
		if (id === '') {
			setTarget('');
			return null;
		}
		setSuccess(null);
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

	const differChangeHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const id = e.target.value;
		if (id === '') {
			setDiffer('');
			return null;
		}
		setSuccess(null);
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

	const radioHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const newval = e.target.value as ActionType;
		setType(newval);
		return null;
	};

	const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
		if (userLoading === true
			|| specificLoading === true
			|| gLoading === true
			|| target === ''
			|| differ === ''
			|| radioArr.includes(type) === false) return null;
		updateGLoading(true);
		setLoading(true);
		setSuccess(null);
		setError(null);
		const form = new FormData(e.target as HTMLFormElement);
		let rawName = form.get('name');
		const newName = typeof (rawName) === 'string' && rawName !== '' ? sanitize(rawName) : null;
		let rawDesc = form.get('desc');
		const newDesc = typeof (rawDesc) === 'string' && rawDesc !== '' ? sanitize(rawDesc.toString()) : null;

		try {
			const raw = await fetch('/api/spotify/create', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					newName,
					newDesc,
					target: {
						id: target.id,
						type: target.type,
						name: target.name,
						owner: target.owner,
						tracks: target.tracks
					},
					differ: {
						id: differ.id,
						type: differ.type,
						name: differ.name,
						owner: differ.owner,
						tracks: differ.tracks
					},
					type: type
				})
			});
			if (raw.status === 401) signIn();
			if (raw.ok === false) {
				const jsoned = await raw.json();
				throw { message: jsoned.message };
			};
			const jsoned = await raw.json() as differRouteResponse;
			updateUserPlaylistsHandler(jsoned.playlist);
			setSuccess(jsoned.part);
		} catch (e: any) {
			setError(e.message || 'Unknown error');
		};
		setLoading(false);
		updateGLoading(false);
		return null;
	};

	return {
		target,
		differ,
		type,
		loading,
		error,
		success,
		targetChangeHandler,
		differChangeHandler,
		radioHandler,
		submitHandler
	}
}

export { useDifferForm };
