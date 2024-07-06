'use client';

import { AppDispatch, selectPage, selectUserPlaylists } from '@/state';
import {
	initPage,
	initPlaylists,
	persistPage,
	persistPlaylists,
} from '@/state/helpers';
import { initUser } from '@/state/userPlaylistsSlice';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const PLAYLISTS_KEY = 'MIXDELTA_USER_PLAYLISTS';
const PAGE_KEY = 'MIXDELTA_USER_PAGE';

export default function UserPersister() {
	const [first, setFirst] = useState(true);
	const dispatch = useDispatch<AppDispatch>();
	const playlists = useSelector(selectUserPlaylists);
	const page = useSelector(selectPage);

	// Init load useEffect to init
	useEffect(() => {
		dispatch(
			initUser({
				page: initPage(PAGE_KEY),
				playlists: initPlaylists(PLAYLISTS_KEY),
			})
		);
		setFirst(false);
	}, []);

	useEffect(() => {
		if (first) {
			return;
		}
		persistPlaylists(PLAYLISTS_KEY, playlists);
		persistPage(PAGE_KEY, page);
	}, [playlists]);

	return null;
}
