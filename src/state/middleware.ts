import { createListenerMiddleware } from '@reduxjs/toolkit';
import { clearUser } from './userPlaylistsSlice';
import { clearDiffer, clearTarget } from './differFormSlice';
import { clearSpecific } from './specificPlaylistsSlice';

import { RootState } from './state';

const listenerMiddleware = createListenerMiddleware<RootState>();

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

export default listenerMiddleware.middleware;
