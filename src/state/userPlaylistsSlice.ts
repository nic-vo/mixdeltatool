import {
	PayloadAction,
	createAsyncThunk,
	createSlice
} from '@reduxjs/toolkit';
import { signIn } from 'next-auth/react';

import type { MyPlaylistObject } from '@components/spotify/types';

type userPage = number | null;
type userError = string | null;

const initialState: {
	playlists: MyPlaylistObject[],
	page: userPage,
	error: userError,
	loading: boolean
} = {
	playlists: [],
	page: 0,
	error: null,
	loading: false,
};

const userPlaylistsSlice = createSlice({
	name: 'userPlaylists',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder.addCase(thingy.pending, (state) => {
			state.loading = true;
			state.error = null;
		})
			.addCase(thingy.fulfilled, (state) => {
				state.loading = false;
			});
	}
});

export const thingy = createAsyncThunk(
	'userPlaylists/thingy',
	async () => {
		try {
			const response = await fetch('/api/spotify/getUser')
		} catch (e:any) {

		}
	}
)

export default userPlaylistsSlice.reducer;
