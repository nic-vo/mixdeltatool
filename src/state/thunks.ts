import { createAsyncThunk } from '@reduxjs/toolkit';
import { signIn } from 'next-auth/react';

import {
	ActionType,
	MyPlaylistObject,
	MyUserAPIRouteResponse,
	differRouteResponse
} from '@components/spotify/types';

export const retrieveSpecificAsync = createAsyncThunk(
	'specificPlaylists/retrieveSpecificAsync',
	async (params: { type: 'album' | 'playlist', id: string }) => {
		try {
			let response;
			try {
				const { id, type } = params;
				if (type !== 'album' && type !== 'playlist')
					throw { message: 'There is an error with this link.' };
				response = await fetch(`/api/spotify/getUser?id=${id}&type=${type}`);
			} catch {
				throw { message: 'There was an error reaching our servers' };
			}
			const jsoned = await response.json();
			// Return early if okay
			if (response.ok) return jsoned as MyPlaylistObject;
			// Any errors get thrown as expected {message: string}
			if (response.status === 401) signIn();
			throw jsoned as { message: string };
		} catch (e: any) {
			// In case I missed something
			throw e.message ? e.message : { message: 'Bad response from server' };
		}
	}
);

export const retrieveUserListsAsync = createAsyncThunk(
	'userPlaylists/retrieveUserListsAsync',
	async (page: number) => {
		if (page === null) throw { message: "You've reached the end." };
		try {
			let response;
			try {
				response = await fetch(`/api/spotify/getUser?page=${page}`);
			} catch {
				throw { message: 'There was an error reaching our servers' };
			}
			// Return early if okay
			const jsoned = await response.json();
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

export const differOperationAsync = createAsyncThunk(
	'differForm/differOperationAsync',
	async (params: {
		newName: string | null,
		newDesc: string | null,
		target: MyPlaylistObject,
		differ: MyPlaylistObject,
		type: ActionType,
		keepImg: boolean
	}) => {
		try {
			const response = await fetch('/api/spotify/create', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ ...params })
			});
			const jsoned = await response.json();
			if (response.ok) return jsoned as differRouteResponse;
			if (response.status === 401) signIn();
			throw jsoned as { message: string };
		} catch (e: any) {
			throw {
				message: e.message && typeof (e.message) === 'string' ?
					e.message : 'Received a bad response from the server'
			}
		}
	}
);
