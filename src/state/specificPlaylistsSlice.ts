import { createSlice } from '@reduxjs/toolkit';
import { initPlaylists, persistPlaylists, sanitizePlaylists } from './helpers';
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
			persistPlaylists(PLAYLISTS_KEY, state.playlists);
		}
	},
	extraReducers: (builder) => {
		builder.addCase(retrieveSpecificAsync.fulfilled,
			(state, action) => {
				const map = new Map();
				const sanitized = sanitizePlaylists([action.payload])[0];
				for (const playlist of state.playlists) map.set(playlist.id, playlist);
				if (!map.has(sanitized.id))
					map.set(action.payload.id, action.payload);
				const setted = Array.from(map.values());
				state.playlists = setted;
				persistPlaylists(PLAYLISTS_KEY, setted);
			});
	}
});

export const { clearSpecific } = specificPlaylistsSlice.actions;

export default specificPlaylistsSlice.reducer;
