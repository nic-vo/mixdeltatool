import { ActionType, MyPlaylistObject } from '@/components/spotify/types';
import MixDeltaLogo from './mdl.svg';
import SpotifyLogo from './Spotify_Logo_RGB_White.png';

export const SPOT_PLAYLIST_PAGE_LIMIT = 49;
export const SPOT_LOGIN_WINDOW = 50 * 60;
export const AUTH_WINDOW = 4000;
export const GLOBAL_EXECUTION_WINDOW = 9500;
export const CLIENT_DIFF_TYPES = {
	stu: 'Only tracks that are in BOTH the target and differ.',
	odu: 'Tracks that exist only in the differ.',
	otu: 'Tracks that exist only in the target.',
	adu: 'The original target + anything new from the differ.',
	bu: 'Only the differences between the target and the differ; no shared.',
};

export function SERVER_DIFF_TYPES(params: {
	target: {
		name: string;
		owner: string;
	};
	differ: {
		name: string;
		owner: string;
	};
	actionType: ActionType;
}) {
	const { target, differ, actionType } = params;
	switch (actionType) {
		case 'adu':
			return (
				`Tracks from ${differ.owner}'s "${differ.name}" were added to ` +
				`${target.owner} 's "${target.name}".`
			);
		case 'odu':
			return (
				`${target.owner}'s ${target.name} was replaced entirely by ` +
				`tracks unique to ${differ.owner}'s "${differ.name}".`
			);
		case 'otu':
			return (
				`Any similarities between ${target.owner}'s "${target.name}" and ` +
				`${differ.owner}'s "${differ.name}" have been removed ` +
				`from "${target.name}"; only tracks unique to it remain.`
			);
		case 'bu':
			return (
				`Any similarities between ${target.owner}'s "${target.name}" ` +
				`and ${differ.owner}'s "${differ.name}" have been removed from ` +
				`"${target.name}"; only tracks unique to either playlist remain.`
			);
		case 'stu':
			return (
				`Only tracks that exist in both ${target.owner}'s ` +
				`"${target.name}" and ${differ.owner}'s "${differ.name}" remain.`
			);
	}
}

export const SPOT_URL_BASE = 'https://api.spotify.com/v1/';

export { MixDeltaLogo, SpotifyLogo };
