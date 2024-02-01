import { createSlice } from '@reduxjs/toolkit';

const initialState: {
	user: boolean,
	specific: boolean,
	global: boolean
} = {
	user: false,
	specific: false,
	global: false
};

const loadStatesSlice = createSlice({
	name: 'gLoading',
	initialState,
	reducers: {
		startUserLoading: (state) => {
			state.user = true;
		},
		endUserLoading: (state) => {
			state.user = false;
		},
		startSpecificLoading: (state) => {
			state.specific = true;
		},
		endSpecificLoading: (state) => {
			state.specific = false;
		},
		startGlobalLoading: (state) => {
			state.global = true;
		},
		endGlobalLoading: (state) => {
			state.global = false;
		},
	},
});

export const {
	startUserLoading,
	endUserLoading,
	startSpecificLoading,
	endSpecificLoading,
	startGlobalLoading,
	endGlobalLoading } = loadStatesSlice.actions;

export default loadStatesSlice.reducer;
