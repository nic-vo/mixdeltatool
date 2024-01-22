import { ActionType, MyPlaylistObject } from '@components/spotify/types';
import MixDeltaLogo from './mdl.svg';
import SpotifyLogo from './Spotify_Logo_RGB_White.png';

export const SPOT_PLAYLIST_PAGE_LIMIT = 49;
export const SPOT_LOGIN_WINDOW = 50 * 60;
export const AUTH_WINDOW = 4000;
export const GLOBAL_EXECUTION_WINDOW = 9500;
export const CLIENT_DIFF_TYPES = {
	'stu': "Only tracks that are in BOTH the target and differ.",
	'odu': "Tracks that exist only in the differ.",
	'otu': "Tracks that exist only in the target.",
	'adu': "The original target + anything new from the differ.",
	'bu': "Only the differences between the target and the differ; no shared.",
};

export const SERVER_DIFF_TYPES = {
	adu: (params: { target: { owner: string, name: string }, differ: { owner: string, name: string } }) => {
		const { target, differ } = params;
		return `Anything different in ${differ.owner}'s "${differ.name}" is added to ${target.owner}'s "${target.name}".`;
	},
	odu: (params: { target: { owner: string, name: string }, differ: { owner: string, name: string } }) => {
		const { target, differ } = params;
		return `All that remains of ${target.owner}'s ${target.name} is anything unique to ${differ.owner}'s "${differ.name}".`;
	},
	otu: (params: { target: { owner: string, name: string }, differ: { owner: string, name: string } }) => {
		const { target, differ } = params;
		return `All that remains is anything unique to ${target.owner}'s "${target.name}".`;
	},
	bu: (params: { target: { owner: string, name: string }, differ: { owner: string, name: string } }) => {
		const { target, differ } = params;
		return `Any similarities between ${target.owner}'s "${target.name}" and ${differ.owner}'s "${differ.name}" are gone; only their uniques remain.`;
	},
	stu: (params: { target: { owner: string, name: string }, differ: { owner: string, name: string } }) => {
		const { target, differ } = params;
		return `Only shared tracks between ${target.owner}'s "${target.name}" and ${differ.owner}'s "${differ.name}".`;
	}
};

export const SPOT_URL_BASE = 'https://api.spotify.com/v1/';
export const APP_NAME = 'MixDelta';
export const MAIN_TITLE = `Compare Spotify playlists and make bulk changes | ${APP_NAME}`;
export const MAIN_DESC = 'A tool for Spotify users to compare playlists and edit them based on the comparisons.';

export {
	MixDeltaLogo,
	SpotifyLogo
}
