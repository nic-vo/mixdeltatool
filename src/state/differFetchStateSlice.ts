import { createSlice } from '@reduxjs/toolkit';
import {
	differOperationAsync,
	retrieveSpecificAsync,
	retrieveUserListsAsync,
} from './thunks';

import type { LoadingState } from '.';

const initialFetchState: LoadingState = {
	loading: false,
	error: null,
};

const differFetchStateSlice = createSlice({
	name: 'differFetchState',
	initialState: initialFetchState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(retrieveSpecificAsync.pending, (state) => {
				state.loading = true;
			})
			.addCase(retrieveUserListsAsync.pending, (state) => {
				state.loading = true;
			})
			.addCase(differOperationAsync.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(retrieveSpecificAsync.fulfilled, (state) => {
				state.loading = false;
			})
			.addCase(retrieveUserListsAsync.fulfilled, (state) => {
				state.loading = false;
			})
			.addCase(differOperationAsync.fulfilled, (state) => {
				state.loading = false;
			})
			.addCase(retrieveSpecificAsync.rejected, (state) => {
				state.loading = false;
			})
			.addCase(retrieveUserListsAsync.rejected, (state) => {
				state.loading = false;
			})
			.addCase(differOperationAsync.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error.message
					? action.error.message
					: 'Bad response from server';
			});
	},
});

export default differFetchStateSlice.reducer;
