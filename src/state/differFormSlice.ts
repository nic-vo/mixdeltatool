import { createSlice } from '@reduxjs/toolkit';
import { differOperationAsync } from './thunks';

import type { ActionType, MyPlaylistObject } from '@components/spotify/types';

export type InitialDifferFormState = {
	target: MyPlaylistObject | '',
	differ: MyPlaylistObject | '',
	type: ActionType | '',
	success: string[] | null,
	playlist: MyPlaylistObject | null,
	onForm: boolean
};

const initialState: InitialDifferFormState = {
	onForm: true,
	target: '',
	differ: '',
	type: '',
	success: null,
	playlist: null,
}

const differFormSlice = createSlice({
	name: 'differForm',
	initialState,
	reducers: {
		clearTarget: (state) => { state.target = '' },
		clearDiffer: (state) => { state.differ = '' },
		resetToForm: (state) => {
			state.success = null;
			state.playlist = null;
			state.onForm = true;
		}
	},
	extraReducers: (builder) => {
		builder.addCase(differOperationAsync.fulfilled,
			(state, action) => {
				state.success = action.payload.part;
				state.playlist = action.payload.playlist;
			});
	}
});

export const {
	clearTarget,
	clearDiffer,
	resetToForm
} = differFormSlice.actions;

export default differFormSlice.reducer;
