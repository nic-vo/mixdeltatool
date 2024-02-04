import { PayloadAction, createSlice } from '@reduxjs/toolkit';
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
		},
		setTarget: (state, action: PayloadAction<MyPlaylistObject | ''>) => {
			state.target = action.payload;
		},
		setDiffer: (state, action: PayloadAction<MyPlaylistObject | ''>) => {
			state.differ = action.payload;
		},
		setAction: (state, action: PayloadAction<ActionType | ''>) => {
			state.type = action.payload;
		}
	},
	extraReducers: (builder) => {
		builder.addCase(differOperationAsync.fulfilled,
			(state, action) => {
				state.success = action.payload.part;
				state.playlist = action.payload.playlist;
			}).addCase(differOperationAsync.pending,
				(state) => {
					state.onForm = false;
				});
	}
});

export const {
	clearTarget,
	clearDiffer,
	resetToForm,
	setTarget,
	setDiffer,
	setAction
} = differFormSlice.actions;

export default differFormSlice.reducer;
