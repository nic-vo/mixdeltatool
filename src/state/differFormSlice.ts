import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { differOperationAsync } from './thunks';

import type { MyPlaylistObject } from '@/lib/validators';
import type { ActionType } from '@/types/spotify';

export type InitialDifferFormState = {
	target: MyPlaylistObject | '';
	differ: MyPlaylistObject | '';
	type: ActionType | '';
	success: string[] | null;
	endPlaylist: MyPlaylistObject | null;
	newName: string | '';
	newDesc: string | '';
	keepImg: boolean;

	onForm: boolean;
};

const initialState: InitialDifferFormState = {
	onForm: true,
	target: '',
	differ: '',
	type: '',
	success: null,
	newName: '',
	newDesc: '',
	keepImg: true,
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
		resetToForm: (state) => {
			state.success = null;
			state.endPlaylist = null;
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
		},
		updateName: (state, action: PayloadAction<string>) => {
			state.newName = action.payload;
		},
		updateDesc: (state, action: PayloadAction<string>) => {
			state.newDesc = action.payload;
		},
		toggleKeepImg: (state) => {
			state.keepImg = !state.keepImg;
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
	resetToForm,
	setTarget,
	setDiffer,
	setAction,
	updateDesc,
	updateName,
	toggleKeepImg,
} = differFormSlice.actions;

export default differFormSlice.reducer;
