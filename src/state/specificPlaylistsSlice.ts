import { createSlice } from '@reduxjs/toolkit';
import { initPlaylists, persistPlaylists, sanitizePlaylists } from './helpers';
import { retrieveSpecificAsync } from './thunks';

import type { MyPlaylistObject } from '@/types/spotify';

const PLAYLISTS_KEY = 'SPEC_PLAYLISTS';

export type InitialSpecificPlaylistsState = {
	playlists: MyPlaylistObject[];
};

const initialState: InitialSpecificPlaylistsState = {
	playlists: initPlaylists(PLAYLISTS_KEY),
};

const specificPlaylistsSlice = createSlice({
	name: 'specificPlaylists',
	initialState,
	reducers: {
		clearSpecific: (state) => {
			state.playlists = [];
			persistPlaylists(PLAYLISTS_KEY, []);
		},
	},
	extraReducers: (builder) => {
		builder.addCase(retrieveSpecificAsync.fulfilled, (state, action) => {
			const set = new Set(state.playlists.map((playlist) => playlist.id));
			const sanitized = sanitizePlaylists([action.payload]);
			if (set.has(sanitized[0].id)) return;
			const deduped = state.playlists.concat(sanitized);
			state.playlists = deduped;
			persistPlaylists(PLAYLISTS_KEY, deduped);
		});
	},
});

export const { clearSpecific } = specificPlaylistsSlice.actions;

export default specificPlaylistsSlice.reducer;
