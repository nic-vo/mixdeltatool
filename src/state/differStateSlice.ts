import { createSlice } from '@reduxjs/toolkit';
import { differOperationAsync } from './thunks';

import type { ActionType, MyPlaylistObject } from '@components/spotify/types';

const initialState: {
	target: MyPlaylistObject | '',
	differ: MyPlaylistObject | '',
	type: ActionType | '',
	error: string | null,
	success: string[] | null,
} = {
	target: '',
	differ: '',
	type: '',
	error: null,
	success: null
}

const differFormSlice = createSlice({
	name: 'differForm',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder.addCase(differOperationAsync.fulfilled,
			(state, action) => {
				state.success = action.payload.part;
				state.playlist = action.payload.playlist;
			});
	}
});

// export const differOperationAsync = createAsyncThunk
