'use client';

import { AppDispatch, selectSpecificPlaylists } from '@/state';
import { initPlaylists, persistPlaylists } from '@/state/helpers';
import { initSpecific } from '@/state/specificPlaylistsSlice';
initSpecific;
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const PLAYLISTS_KEY = 'MIXDELTA_SPECIFIC_PLAYLISTS';

export default function SpecificPersister() {
	const [first, setFirst] = useState(true);
	const dispatch = useDispatch<AppDispatch>();
	const playlists = useSelector(selectSpecificPlaylists);

	// Init load useEffect to init
	useEffect(() => {
		dispatch(initSpecific(initPlaylists(PLAYLISTS_KEY)));
		setFirst(false);
	}, []);

	useEffect(() => {
		if (first) {
			return;
		}
		persistPlaylists(PLAYLISTS_KEY, playlists);
	}, [playlists]);

	return null;
}
