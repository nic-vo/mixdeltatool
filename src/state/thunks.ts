import { createAsyncThunk } from '@reduxjs/toolkit';
import { signOut } from 'next-auth/react';

import type {
	MyUserAPIRouteResponse,
	differRouteResponse,
} from '@/types/spotify';
import type { MyPlaylistObject } from '@/lib/validators';
import type { RootState } from '.';

/**
 * ANY ERRORS THROWN AS { message: string }
 */

/*

	For my auth configuration, access key rotation should happen automaticaly
	So if a response 401s, it's best to restart auth flow completely

*/

export const retrieveSpecificAsync = createAsyncThunk(
	'specificPlaylists/retrieveSpecificAsync',
	async (url: string) => {
		// Pass e.target.value from simple form
		// Check input before fetching
		const splitBegin = url.split('.com/')[1];
		if (splitBegin === undefined)
			throw { message: 'There is an error with this link.' };

		const type = splitBegin.split('/')[0] as 'album' | 'playlist';
		const id = splitBegin.split('/')[1].split('?si')[0];

		// https://open.spotify.com/playlist/4wjsfnoRSCNg0BAV4nvSj6?si=35d3a5a4c6f5493d
		// https://open.spotify.com/album/12DmuRtZNTx84ELHKD3VGL?si=d79c7c1965564e77
		if ((type !== 'album' && type !== 'playlist') || id.length !== 22)
			throw { message: 'There is an error with this link.' };

		let response, json;
		try {
			response = await fetch(`/api/spotify/specific?id=${id}&type=${type}`);
			json = await response.json();
		} catch {
			throw { message: 'There was an error reaching our servers' };
		}
		if (response.ok) return json as MyPlaylistObject;
		if (response.status === 401) signOut();
		throw json as { message: string };
	}
);

export const retrieveUserListsAsync = createAsyncThunk(
	'userPlaylists/retrieveUserListsAsync',
	async (_, api) => {
		const {
			userPlaylists: { page },
		} = api.getState() as RootState;
		if (page === null) throw { message: "You've reached the end." };

		let response, json;
		try {
			response = await fetch(`/api/spotify/user?page=${page}`);
			json = await response.json();
		} catch {
			throw { message: 'There was an error reaching our servers' };
		}
		if (response.ok) return json as MyUserAPIRouteResponse;
		if (response.status === 401) signOut();
		throw json as { message: string };
	}
);

export const differOperationAsync = createAsyncThunk(
	'differForm/differOperationAsync',
	async (_, api) => {
		const { differForm: df, differOptionalForm: dfo } =
			api.getState() as RootState;

		const { target, differ, action } = df;
		const { keepImg } = dfo;
		if (target === '') throw { message: 'Target missing' };
		if (differ === '') throw { message: 'Differ missing' };
		if (action === '') throw { message: 'Type missing' };
		const body = {
			target,
			differ,
			action,
			keepImg,
			newName: dfo.newName !== '' ? dfo.newName : null,
			newDesc: dfo.newDesc !== '' ? dfo.newDesc : null,
		};
		const response = await fetch('/api/spotify/create', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(body),
		});
		const jsoned = await response.json();
		if (response.ok) return jsoned as differRouteResponse;
		if (response.status === 401) signOut();
		throw jsoned as { message: string };
	}
);
