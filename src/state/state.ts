import { configureStore } from '@reduxjs/toolkit';
import loadStatesSliceReducer from './loadStatesSlice';
import userPlaylistsReducer from './userPlaylistsSlice';
import specificPlaylistsReducer from './specificPlaylistsSlice';

export const store = configureStore({
	reducer: {
		loadStates: loadStatesSliceReducer,
		userPlaylists: userPlaylistsReducer,
		specificPlaylists: specificPlaylistsReducer
	}
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
