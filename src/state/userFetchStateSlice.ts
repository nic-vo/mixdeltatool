import { createSlice } from '@reduxjs/toolkit';
import { differOperationAsync, retrieveUserListsAsync } from './thunks';

import { LoadingState } from './state';

const initialState: LoadingState = {
	loading: false,
	error: null
};

const userFetchStateSlice = createSlice({
	name: 'userFetchState',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder.addCase(differOperationAsync.pending, (state) => {
			state.loading = true;
		}).addCase(differOperationAsync.fulfilled, (state) => {
			state.loading = false;
		}).addCase(differOperationAsync.rejected, (state) => {
			state.loading = false;
		}).addCase(retrieveUserListsAsync.pending, (state) => {
			state.loading = true;
			state.error = null;
		}).addCase(retrieveUserListsAsync.fulfilled, (state) => {
			state.loading = false;
		}).addCase(retrieveUserListsAsync.rejected, (state, action) => {
			state.loading = false;
			state.error = action.error.message ?
				action.error.message : 'Bad response from server';
		});
	}
});

export default userFetchStateSlice.reducer;
