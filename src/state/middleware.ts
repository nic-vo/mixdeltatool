import { createListenerMiddleware } from '@reduxjs/toolkit';
import { clearUser } from './userPlaylistsSlice';
import { clearDiffer, clearTarget } from './differFormSlice';
import { clearSpecific } from './specificPlaylistsSlice';

import { RootState } from './state';
import { retrieveSpecificAsync } from './thunks';

const listenerMiddleware = createListenerMiddleware<RootState>();

// Check if target or differ were cleared with userPlaylists
listenerMiddleware.startListening({
	actionCreator: clearUser,
	effect: (_, api) => {
		const original = api.getOriginalState();
		const { playlists } = original.userPlaylists;
		const { target, differ } = original.differForm;
		const map = new Map();
		for (const playlist of playlists) map.set(playlist.id, playlist);
		if (differ !== '' && map.has(differ.id)) api.dispatch(clearDiffer());
		if (target !== '' && map.has(target.id)) api.dispatch(clearTarget());
	}
});
// Check if target or differ were cleared with specificPlaylists
listenerMiddleware.startListening({
	actionCreator: clearSpecific,
	effect: (_, api) => {
		const original = api.getOriginalState();
		const { playlists } = original.specificPlaylists;
		const { target, differ } = original.differForm;
		const map = new Map();
		for (const playlist of playlists) map.set(playlist.id, playlist);
		if (differ !== '' && map.has(differ.id)) api.dispatch(clearDiffer());
		if (target !== '' && map.has(target.id)) api.dispatch(clearTarget());
	}
});
// At some point, maybe a middleware that can block retrieveSpecific
// With an ID that already exists

export default listenerMiddleware.middleware;
