import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { differOperationAsync } from './thunks';

export type InitialDifferOptionalFormState = {
	newName: string | '';
	newDesc: string | '';
	keepImg: boolean;
};

const initialState: InitialDifferOptionalFormState = {
	newName: '',
	newDesc: '',
	keepImg: true,
};

const differOptionalFormSlice = createSlice({
	name: 'differFormOptional',
	initialState,
	reducers: {
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
	extraReducers: (builder) =>
		builder.addCase(differOperationAsync.fulfilled, (state) => {
			state.newName = '';
			state.newDesc = '';
		}),
});

export const { updateName, updateDesc, toggleKeepImg } =
	differOptionalFormSlice.actions;

export default differOptionalFormSlice.reducer;
