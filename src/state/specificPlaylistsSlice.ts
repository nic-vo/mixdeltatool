import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { sanitizePlaylists } from './helpers';
import { retrieveSpecificAsync } from './thunks';

import type { MyPlaylistObject } from '@/lib/validators';

export type InitialSpecificPlaylistsState = {
	playlists: MyPlaylistObject[];
};

const initialState: InitialSpecificPlaylistsState = {
	playlists: [],
};

const specificPlaylistsSlice = createSlice({
	name: 'specificPlaylists',
	initialState,
	reducers: {
		initSpecific: (state, action: PayloadAction<MyPlaylistObject[]>) => {
			state.playlists = [...action.payload];
		},
		clearSpecific: (state) => {
			state.playlists = [];
		},
	},
	extraReducers: (builder) => {
		builder.addCase(retrieveSpecificAsync.fulfilled, (state, action) => {
			const set = new Set(state.playlists.map((playlist) => playlist.id));
			const sanitized = sanitizePlaylists([action.payload]);
			if (set.has(sanitized[0].id)) return;
			const deduped = state.playlists.concat(sanitized);
			state.playlists = deduped;
		});
	},
});

export const { initSpecific, clearSpecific } = specificPlaylistsSlice.actions;

export default specificPlaylistsSlice.reducer;
