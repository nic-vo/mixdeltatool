import { createSlice } from '@reduxjs/toolkit';
import type { MyPlaylistObject } from '@components/spotify/types';

const initialState: {
	value: MyPlaylistObject[],
	page: number | null
} = {
	value: [],
	page: 0
};

const specificPlaylistsSlice = createSlice({
	name: 'specificPlaylists',
	initialState,
	reducers: {},
});

export default specificPlaylistsSlice.reducer;
