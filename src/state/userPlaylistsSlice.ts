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
			persistPlaylists(PLAYLISTS_KEY, state.playlists);
			persistPage(0, PAGE_KEY);
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(retrieveUserListsAsync.fulfilled, (state, action) => {
				state.page = action.payload.next;
				const sanitized = sanitizePlaylists([...action.payload.playlists]);
				const setted = Array.from(new Set([...state.playlists, ...sanitized]));
				state.playlists = setted;
				persistPlaylists(PLAYLISTS_KEY, setted);
				persistPage(action.payload.next, PAGE_KEY);
			})
			.addCase(differOperationAsync.fulfilled, (state, action) => {
				state.playlists = [action.payload.playlist].concat(state.playlists);
			});
	},
});

export const { clearUser } = userPlaylistsSlice.actions;

export default userPlaylistsSlice.reducer;
