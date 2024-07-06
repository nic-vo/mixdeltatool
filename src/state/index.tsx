'use client';

import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

// Slices and initial types
// User
import userPlaylistsReducer, {
	InitialUserPlaylistsState,
} from './userPlaylistsSlice';
import userFetchStateReducer from './userFetchStateSlice';
// Specific
import specificPlaylistsReducer, {
	InitialSpecificPlaylistsState,
} from './specificPlaylistsSlice';
import specificFetchStateReducer from './specificFetchStateSlice';
// Differ
import differFormSliceReducer, {
	InitialDifferFormState,
} from './differFormSlice';
import differFetchStateSliceReducer from './differFetchStateSlice';

import listenerMiddleware from './middleware';
import type { PropsWithChildren } from 'react';

export type LoadingState = {
	loading: boolean;
	error: string | null;
};

export type RootState = {
	userPlaylists: InitialUserPlaylistsState;
	specificPlaylists: InitialSpecificPlaylistsState;
	differForm: InitialDifferFormState;
	userFetchState: LoadingState;
	specificFetchState: LoadingState;
	differFetchState: LoadingState;
};

export const store = configureStore({
	reducer: {
		userPlaylists: userPlaylistsReducer,
		specificPlaylists: specificPlaylistsReducer,
		differForm: differFormSliceReducer,
		specificFetchState: specificFetchStateReducer,
		userFetchState: userFetchStateReducer,
		differFetchState: differFetchStateSliceReducer,
	},
	middleware: (getDefault) => {
		return getDefault().concat(listenerMiddleware);
	},
});

export const selectSpecificFetch = (s: RootState) => s.specificFetchState;
export const selectSpecificPlaylists = (s: RootState) =>
	s.specificPlaylists.playlists;

export const selectUserPlaylists = (s: RootState) => s.userPlaylists.playlists;
export const selectUserFetch = (s: RootState) => s.userFetchState;
export const selectPage = (s: RootState) => s.userPlaylists.page;

export const selectOnForm = (s: RootState) => s.differForm.onForm;
export const selectDifferForm = (s: RootState) => s.differForm;
export const selectDifferFetch = (s: RootState) => s.differFetchState;

export type AppDispatch = typeof store.dispatch;

export const ClientReduxProvider = (props: PropsWithChildren) => (
	<Provider store={store}>{props.children}</Provider>
);
