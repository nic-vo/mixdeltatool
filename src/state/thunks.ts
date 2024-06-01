import { createAsyncThunk } from '@reduxjs/toolkit';
import { signIn } from 'next-auth/react';

import {
	MyPlaylistObject,
	MyUserAPIRouteResponse,
	differRouteResponse,
} from '@/components/spotify/types';
import { RootState } from './state';

export const retrieveSpecificAsync = createAsyncThunk(
	'specificPlaylists/retrieveSpecificAsync',
	async (params: { url: string }) => {
		try {
			// Check input before fetching
			const splitBegin = params.url.split('.com/')[1];
			if (splitBegin === undefined)
				throw { message: 'There is an error with this link.' };

			const type = splitBegin.split('/')[0] as 'album' | 'playlist';
			const id = splitBegin.split('/')[1].split('?si')[0];
			if ((type !== 'album' && type !== 'playlist') || id === undefined)
				throw { message: 'There is an error with this link.' };

			let response;
			try {
				response = await fetch(
					`/api/spotify/getSpecific?id=${id}&type=${type}`
				);
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
	async (_, thunkAPI) => {
		const { userPlaylists } = thunkAPI.getState() as RootState;
		const { page } = userPlaylists;
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
	async (_, thunkAPI) => {
		try {
			const { differForm: df } = thunkAPI.getState() as RootState;

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
		} catch (e: any) {
			throw {
				message:
					e.message && typeof e.message === 'string'
						? e.message
						: 'Received a bad response from the server',
			};
		}
	}
);
