import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { signIn } from 'next-auth/react';
import { initPlaylists, persistPlaylists } from './helpers';

import type { MyPlaylistObject } from '@components/spotify/types';

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
		builder.addCase(retrieveSpecificListAsync.pending, (state) => {
			state.error = null;
		}).addCase(retrieveSpecificListAsync.fulfilled,
			(state, action: PayloadAction<MyPlaylistObject>) => {
				const idSet = new Set(state.playlists.map(playlist => playlist.id));
				if (idSet.has(action.payload.id)) {
					state.error = 'You already have this playlist';
				} else {
					const setted = Array.from(
						new Set([...state.playlists, action.payload])
					);
					state.playlists = setted;
					persistPlaylists(setted, PLAYLISTS_KEY);
				}
			}).addCase(retrieveSpecificListAsync.rejected, (state, action) => {
				state.error = typeof (action.error.message) === 'string' ?
					action.error.message : 'Unknown error';
			})
	}
});

export const selectSpecificPlaylists = (s: typeof initialState) => s.playlists;

export const retrieveSpecificListAsync = createAsyncThunk(
	'userPlaylists/retrieveSpecificListAsync',
	async (params: { type: 'album' | 'playlist', id: string }) => {
		try {
			let response;
			try {
				const { id, type } = params;
				if (type !== 'album' && type !== 'playlist')
					throw { message: 'There is an error with this link.' };
				response = await fetch(`/api/spotify/getUser?id=${id}&type=${type}`);
			} catch {
				throw { message: 'There was an error reaching our servers' };
			}
			const jsoned = await response.json();
			if (!response.ok) {
				if (response.status === 401) signIn();
				const { message } = jsoned as { message: string };
				throw { message };
			}
			return jsoned as MyPlaylistObject;
		} catch (e: any) {
			throw e.message ? e.message : 'Unknown error';
		}
	}
);
export default specificPlaylistsSlice.reducer;
