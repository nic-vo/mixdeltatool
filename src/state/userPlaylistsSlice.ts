import { createSlice } from '@reduxjs/toolkit';
import {
	initPage,
	initPlaylists,
	persistPage,
	persistPlaylists,
	sanitizePlaylists,
} from './helpers';
import { differOperationAsync, retrieveUserListsAsync } from './thunks';

import type { MyPlaylistObject } from '@/components/spotify/types';

type userPage = number | null;
export type InitialUserPlaylistsState = {
	playlists: MyPlaylistObject[];
	page: userPage;
};

const PLAYLISTS_KEY = 'USER_PLAYLISTS';
const PAGE_KEY = 'USER_PLAYLISTS_PAGE';

const initialState: InitialUserPlaylistsState = {
	playlists: initPlaylists(PLAYLISTS_KEY),
	page: initPage(PAGE_KEY),
};

const userPlaylistsSlice = createSlice({
	name: 'userPlaylists',
	initialState,
	reducers: {
		clearUser: (state) => {
			// This should trigger differ middleware
			state.playlists = [];
			state.page = 0;
			persistPlaylists(PLAYLISTS_KEY, []);
			persistPage(PAGE_KEY, 0);
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(retrieveUserListsAsync.fulfilled, (state, action) => {
				// Sanitize new playlist array an dedupe
				const sanitizedAndDeduped = Array.from(
					new Set([
						...state.playlists,
						...sanitizePlaylists([...action.payload.playlists]),
					])
				);
				state.playlists = sanitizedAndDeduped;
				persistPlaylists(PLAYLISTS_KEY, sanitizedAndDeduped);

				state.page = action.payload.next;
				persistPage(PAGE_KEY, action.payload.next);
			})
			.addCase(differOperationAsync.fulfilled, (state, action) => {
				const sanitizedAndAdded = state.playlists.concat(
					sanitizePlaylists([action.payload.playlist])[0]
				);
				state.playlists = sanitizedAndAdded;
				persistPlaylists(PLAYLISTS_KEY, sanitizedAndAdded);
			});
	},
});

export const { clearUser } = userPlaylistsSlice.actions;

export default userPlaylistsSlice.reducer;
