import {
	PayloadAction,
	createAsyncThunk,
	createSlice
} from '@reduxjs/toolkit';
import { signIn } from 'next-auth/react';
import { startGlobalLoading, endGlobalLoading } from './loadStatesSlice';

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

const differStateSlice = createSlice({
	name: 'differState',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
	}
});

// export const differOperationAsync = createAsyncThunk
