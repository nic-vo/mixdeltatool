import { createSlice } from '@reduxjs/toolkit';
import { initPlaylists, persistPlaylists } from './helpers';
import { retrieveSpecificAsync } from './thunks';

import type { MyPlaylistObject } from '@components/spotify/types';
import { endSpecificLoading, startSpecificLoading } from './loadStatesSlice';

const PLAYLISTS_KEY = 'SPEC_PLAYLISTS';

const initialState: {
	playlists: MyPlaylistObject[],
	error: string | null
} = {
	playlists: initPlaylists(PLAYLISTS_KEY),
	error: null
};

const specificPlaylistsSlice = createSlice({
	name: 'specificPlaylists',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder.addCase(retrieveSpecificAsync.fulfilled,
			(state, action) => {
				const setted = [...state.playlists, action.payload];
				state.playlists = setted;
				persistPlaylists(PLAYLISTS_KEY, setted);
			});
	}
});

export const selectSpecificPlaylists = (s: typeof initialState) => s.playlists;

export default specificPlaylistsSlice.reducer;
