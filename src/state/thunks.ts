import { createAsyncThunk } from '@reduxjs/toolkit';
import { signIn } from 'next-auth/react';

import {
	MyPlaylistObject,
	MyUserAPIRouteResponse,
	differRouteResponse,
} from '@/types/spotify';
import { RootState } from './state';

/**
 * ANY ERRORS THROWN AS { message: string }
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
		if (response.status === 401) signIn();
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
		if (response.status === 401) signIn();
		throw json as { message: string };
	}
);

export const differOperationAsync = createAsyncThunk(
	'differForm/differOperationAsync',
	async (_, api) => {
		const { differForm: df } = api.getState() as RootState;

		const { target, differ, type, keepImg } = df;
		if (target === '') throw { message: 'Target missing' };
		if (differ === '') throw { message: 'Differ missing' };
		if (type === '') throw { message: 'Type missing' };
		const body = {
			target,
			differ,
			type,
			keepImg,
			newName: df.newName !== '' ? df.newName : null,
			newDesc: df.newDesc !== '' ? df.newDesc : null,
		};
		const response = await fetch('/api/spotify/create', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(body),
		});
		const jsoned = await response.json();
		if (response.ok) return jsoned as differRouteResponse;
		if (response.status === 401) signIn();
		throw jsoned as { message: string };
	}
);
