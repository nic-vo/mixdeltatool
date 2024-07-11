import { MyPlaylistObject, SpotPlaylistObject } from '@/lib/validators';
import { NextApiRequest } from 'next';

interface BasicSpotObj {
	id: string;
	uri: string;
	href: string;
}

export interface SpotPlaylistTrackObject {
	track: null | (Pick<BasicSpotObj, 'uri'> & { is_local: boolean });
}

export interface BasicSpotApiResponse {
	href: string;
	next: string | null;
}

export interface SpotUserPlaylistsResponse extends BasicSpotApiResponse {
	items: SpotPlaylistObject[];
}

export interface MyUserAPIRouteResponse {
	next: number | null;
	playlists: MyPlaylistObject[];
}

export type ActionType = 'adu' | 'odu' | 'otu' | 'bu' | 'stu';

export interface createDiffPlaylistApiRequest extends NextApiRequest {
	body: {
		target: MyPlaylistObject;
		differ: MyPlaylistObject;
		type: 'adu' | 'odu' | 'otu' | 'bu' | 'stu';
	};
}

/*
	'adu' === 'add differ's uniques' / 'keep the target but add everything unique from the differ'
	'odu' === 'only differ's uniques' / 'delete everything except what's unique to the differ'
	'otu' === 'only target's uniques' / 'delete everything except what's unique to the target'
	'bu' === 'both uniques' / 'delete all similarities but keep all differences'
	'stu' === 'keep only similarities'
*/

export interface SpotPlaylistTracksResponse extends BasicSpotApiResponse {
	total: number;
	items: SpotPlaylistTrackObject[];
}

export interface SpotAlbumTracksResponse extends BasicSpotApiResponse {
	total: number;
	items: {
		uri: string;
	}[];
}

export interface differInternalPlaylistPromise {
	total: number;
	completed: number;
	items: string[];
}

export interface differRouteResponse {
	part: string[];
	playlist: MyPlaylistObject;
}

export interface differInternalAddPromise {
	total: number;
	completed: number;
}
