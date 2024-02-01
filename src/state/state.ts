import { configureStore } from '@reduxjs/toolkit';
import gLoadingReducer from './gLoadingSlice';
import userPlaylistsReducer from './userPlaylistsSlice';
import specificPlaylistsReducer from './specificPlaylistsSlice';

export const store = configureStore({
	reducer: {
		gLoading: gLoadingReducer,
		userPlaylists: userPlaylistsReducer,
		specificPlaylists: specificPlaylistsReducer
	}
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
