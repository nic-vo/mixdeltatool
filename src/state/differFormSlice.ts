import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { differOperationAsync } from './thunks';

import type { MyPlaylistObject } from '@/lib/validators';
import type { ActionType } from '@/types/spotify';

export type InitialDifferFormState = {
	target: MyPlaylistObject | '';
	differ: MyPlaylistObject | '';
	action: ActionType | '';
	success: string[] | null;
	endPlaylist: MyPlaylistObject | null;
	onForm: boolean;
};

const initialState: InitialDifferFormState = {
	onForm: true,
	target: '',
	differ: '',
	action: '',
	success: null,
	endPlaylist: null,
};

const differFormSlice = createSlice({
	name: 'differForm',
	initialState,
	reducers: {
		clearTarget: (state) => {
			state.target = '';
		},
		clearDiffer: (state) => {
			state.differ = '';
		},
		clearAction: (state) => {
			state.action = '';
		},
		resetToForm: (state) => {
			state.onForm = true;
			state.target = '';
			state.differ = '';
			state.action = '';
			state.success = null;
			state.endPlaylist = null;
		},
		setTarget: (state, action: PayloadAction<MyPlaylistObject>) => {
			state.target = action.payload;
		},
		setDiffer: (state, action: PayloadAction<MyPlaylistObject>) => {
			state.differ = action.payload;
		},
		setAction: (state, action: PayloadAction<ActionType | ''>) => {
			state.action = action.payload;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(differOperationAsync.fulfilled, (state, action) => {
				state.success = action.payload.part;
				state.endPlaylist = action.payload.playlist;
			})
			.addCase(differOperationAsync.pending, (state) => {
				state.onForm = false;
			});
	},
});

export const {
	clearTarget,
	clearDiffer,
	clearAction,
	resetToForm,
	setTarget,
	setDiffer,
	setAction,
} = differFormSlice.actions;

export default differFormSlice.reducer;
