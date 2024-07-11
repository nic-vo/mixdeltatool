'use client';

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { sanitizePlaylists } from './helpers';
import { differOperationAsync, retrieveUserListsAsync } from './thunks';

import type { MyPlaylistObject } from '@/lib/validators';

type userPage = number | null;
export type InitialUserPlaylistsState = {
	playlists: MyPlaylistObject[];
	page: userPage;
};

const initialState: InitialUserPlaylistsState = {
	playlists: [],
	page: 0,
};

const userPlaylistsSlice = createSlice({
	name: 'userPlaylists',
	initialState,
	reducers: {
		initUser: (
			state,
			action: PayloadAction<{
				playlists: MyPlaylistObject[];
				page: number | null;
			}>
		) => {
			state.playlists = [...action.payload.playlists];
			state.page = action.payload.page;
		},
		clearUser: (state) => {
			state.playlists = [];
			state.page = 0;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(retrieveUserListsAsync.fulfilled, (state, action) => {
				// Sanitize new playlist array an dedupe
				state.playlists = state.playlists.concat(
					sanitizePlaylists(action.payload.playlists)
				);
				state.page = action.payload.next;
			})
			.addCase(differOperationAsync.fulfilled, (state, action) => {
				const sanitizedAndAdded = sanitizePlaylists([
					action.payload.playlist,
				]).concat([...state.playlists]);
				state.playlists = sanitizedAndAdded;
			});
	},
});

export const { clearUser, initUser } = userPlaylistsSlice.actions;

export default userPlaylistsSlice.reducer;
