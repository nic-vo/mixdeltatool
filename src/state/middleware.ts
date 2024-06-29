import { createListenerMiddleware } from '@reduxjs/toolkit';
import { clearUser } from './userPlaylistsSlice';
import { clearDiffer, clearTarget } from './differFormSlice';
import { clearSpecific } from './specificPlaylistsSlice';

import { RootState } from './state';

const listenerMiddleware = createListenerMiddleware<RootState>();

// Check if target or differ were cleared with userPlaylists
listenerMiddleware.startListening({
	actionCreator: clearUser,
	effect: (_, api) => {
		const {
			userPlaylists: { playlists },
			differForm: { target, differ },
		} = api.getOriginalState();
		const set = new Set(playlists.map(({ id }) => id));
		if (differ !== '' && set.has(differ.id)) api.dispatch(clearDiffer());
		if (target !== '' && set.has(target.id)) api.dispatch(clearTarget());
	},
});
// Check if target or differ were cleared with specificPlaylists
listenerMiddleware.startListening({
	actionCreator: clearSpecific,
	effect: (_, api) => {
		const {
			userPlaylists: { playlists },
			differForm: { target, differ },
		} = api.getOriginalState();
		const set = new Set(playlists.map(({ id }) => id));
		if (differ !== '' && set.has(differ.id)) api.dispatch(clearDiffer());
		if (target !== '' && set.has(target.id)) api.dispatch(clearTarget());
	},
});
// At some point, maybe a middleware that can block retrieveSpecific
// With an ID that already exists

export default listenerMiddleware.middleware;
