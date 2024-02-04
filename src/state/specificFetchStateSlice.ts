import { createSlice } from '@reduxjs/toolkit';
import { differOperationAsync, retrieveSpecificAsync } from './thunks';

import { LoadingState } from './state';

const initialState: LoadingState = {
	loading: false,
	error: null
};

const specificFetchStateSlice = createSlice({
	name: 'specificFetchState',
	initialState,
	reducers: {
		badInput: (state) => {
			state.error = 'That link is formatted incorrectly';
		}
	},
	extraReducers: (builder) => {
		builder.addCase(differOperationAsync.pending, (state) => {
			state.loading = true;
		}).addCase(differOperationAsync.fulfilled, (state) => {
			state.loading = false;
		}).addCase(differOperationAsync.rejected, (state) => {
			state.loading = false;
		}).addCase(retrieveSpecificAsync.pending, (state) => {
			state.loading = true;
			state.error = null;
		}).addCase(retrieveSpecificAsync.fulfilled, (state) => {
			state.loading = false;
		}).addCase(retrieveSpecificAsync.rejected, (state, action) => {
			state.loading = false;
			state.error = action.error.message ?
				action.error.message : 'Bad response from server';
		});
	}
});

export const { badInput } = specificFetchStateSlice.actions;

export default specificFetchStateSlice.reducer;
