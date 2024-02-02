import {
	PayloadAction,
	createAsyncThunk,
	createSlice
} from '@reduxjs/toolkit';
import { signIn } from 'next-auth/react';
import {
	initPage,
	initPlaylists,
	persistPage,
	persistPlaylists
} from './helpers';
import { endUserLoading, startUserLoading } from './loadStatesSlice';

import type {
	MyPlaylistObject,
	MyUserAPIRouteResponse
} from '@components/spotify/types';

type userPage = number | null;
type userError = string | null;

const PLAYLISTS_KEY = 'USER_PLAYLISTS';
const PAGE_KEY = 'USER_PLAYLISTS_PAGE';

const initialState: {
	playlists: MyPlaylistObject[],
	page: userPage,
	error: userError,
} = {
	playlists: initPlaylists(PLAYLISTS_KEY),
	page: initPage(PAGE_KEY),
	error: null,
};

const userPlaylistsSlice = createSlice({
	name: 'userPlaylists',
	initialState,
	reducers: {
		postDiffAddition: (state, action: PayloadAction<MyPlaylistObject>) => {
			state.playlists = [...state.playlists, action.payload];
		}
	},
	extraReducers: (builder) => {
		builder.addCase(retrieveUserListsAsync.pending, (state) => {
			startUserLoading();
			state.error = null;
		}).addCase(retrieveUserListsAsync.fulfilled,
			(state, action: PayloadAction<MyUserAPIRouteResponse>) => {
				endUserLoading();
				state.page = action.payload.next;
				const setted = Array.from(
					new Set([...state.playlists, ...action.payload.playlists])
				);
				state.playlists = setted;
				persistPlaylists(setted, PLAYLISTS_KEY);
				persistPage(action.payload.next, PAGE_KEY);
			}).addCase(retrieveUserListsAsync.rejected, (state, action) => {
				endUserLoading();
				state.error = typeof (action.error.message) === 'string' ?
					action.error.message : 'Unknown error';
			})
	}
});

export const selectUserPlaylists = (s: typeof initialState) => s.playlists;

export const { postDiffAddition } = userPlaylistsSlice.actions;

export const retrieveUserListsAsync = createAsyncThunk(
	'userPlaylists/retrieveUserListsAsync',
	async (page: number) => {
		try {
			let response;
			try {
				response = await fetch(`/api/spotify/getUser?page=${page}`);
			} catch {
				throw { message: 'There was an error reaching our servers' };
			}
			const jsoned = await response.json();
			// Return early if okay
			if (response.ok) return jsoned as MyUserAPIRouteResponse;
			// Any errors get thrown as expected {message: string}
			if (response.status === 401) signIn();
			throw jsoned as { message: string };
		} catch (e: any) {
			// In case I missed something
			throw e.message ? e.message : { message: 'Bad response from server' };
		}
	}
);

export default userPlaylistsSlice.reducer;
