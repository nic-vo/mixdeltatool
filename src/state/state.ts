import { configureStore } from '@reduxjs/toolkit';

// Slices and initial types
// User
import userPlaylistsReducer,
{ InitialUserPlaylistsState } from './userPlaylistsSlice';
import userFetchStateReducer from './userFetchStateSlice';
// Specific
import specificPlaylistsReducer,
{ InitialSpecificPlaylistsState } from './specificPlaylistsSlice';
import specificFetchStateReducer from './specificFetchStateSlice';
// Differ
import differFormSliceReducer,
{ InitialDifferFormState } from './differFormSlice';
import differFetchStateSliceReducer from './differFetchStateSlice';

import listenerMiddleware from './middleware';

export type LoadingState = {
	loading: boolean,
	error: string | null
};

export type RootState = {
	userPlaylists: InitialUserPlaylistsState,
	specificPlaylists: InitialSpecificPlaylistsState,
	differForm: InitialDifferFormState,
	userFetchState: LoadingState,
	specificFetchState: LoadingState,
	differFetchState: LoadingState
};

export const store = configureStore({
	reducer: {
		userPlaylists: userPlaylistsReducer,
		specificPlaylists: specificPlaylistsReducer,
		differForm: differFormSliceReducer,
		specificFetchState: specificFetchStateReducer,
		userFetchState: userFetchStateReducer,
		differFetchState: differFetchStateSliceReducer
	},
	middleware: (getDefault) => {
		return getDefault().concat(listenerMiddleware);
	}
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
