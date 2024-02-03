import { createSlice } from '@reduxjs/toolkit';
import { initPlaylists, persistPlaylists } from './helpers';
import { retrieveSpecificAsync } from './thunks';

import type { MyPlaylistObject } from '@components/spotify/types';

const PLAYLISTS_KEY = 'SPEC_PLAYLISTS';

export type InitialSpecificPlaylistsState = {
	playlists: MyPlaylistObject[]
}

const initialState: InitialSpecificPlaylistsState = {
	playlists: initPlaylists(PLAYLISTS_KEY)
};

const specificPlaylistsSlice = createSlice({
	name: 'specificPlaylists',
	initialState,
	reducers: {
		clearSpecific: (state) => {
			state.playlists = [];
		}
	},
	extraReducers: (builder) => {
		builder.addCase(retrieveSpecificAsync.fulfilled,
			(state, action) => {
				const setted = [...state.playlists, action.payload];
				state.playlists = setted;
				persistPlaylists(PLAYLISTS_KEY, setted);
			});
	}
});

export const { clearSpecific } = specificPlaylistsSlice.actions;

export default specificPlaylistsSlice.reducer;
