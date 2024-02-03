import { createSlice } from '@reduxjs/toolkit';
import {
	initPage,
	initPlaylists,
	persistPage,
	persistPlaylists
} from './helpers';
import { differOperationAsync, retrieveUserListsAsync } from './thunks';

import type { MyPlaylistObject } from '@components/spotify/types';

type userPage = number | null;
export type InitialUserPlaylistsState = {
	playlists: MyPlaylistObject[],
	page: userPage
}

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
		},
		resetPage: (state) => {
			state.page = 0;
		}
	},
	extraReducers: (builder) => {
		builder.addCase(retrieveUserListsAsync.fulfilled,
			(state, action) => {
				state.page = action.payload.next;
				const setted = Array.from(
					new Set([...state.playlists, ...action.payload.playlists])
				);
				state.playlists = setted;
				persistPlaylists(setted, PLAYLISTS_KEY);
				persistPage(action.payload.next, PAGE_KEY);
			}).addCase(differOperationAsync.fulfilled, (state, action) => {
				state.playlists = state.playlists.concat(action.payload.playlist);
			});
	}
});

export const { clearUser } = userPlaylistsSlice.actions;

export default userPlaylistsSlice.reducer;
