import { NextApiRequest } from 'next';

interface BasicSpotObj {
	id: string,
	uri: string,
	href: string
}

export interface SpotPlaylistObject extends BasicSpotObj {
	collaborative: boolean,
	description: string | null,
	images: SpotImageObject[]
	name: string,
	owner: SpotUser,
	public: boolean,
	snapshot_id: string,
	tracks: { href: string, total: number },
	type: 'playlist'
}

export interface SpotAlbumObject extends BasicSpotObj {
	album_type: 'album' | 'single' | 'compilation',
	artists: SpotArtistObject[],
	total_tracks: number,
	available_markets: string[],
	external_urls: { spotify: string },
	images: SpotImageObject[],
	name: string,
	release_date: string,
	release_date_precision: 'year' | 'month' | 'day',
	tracks: {
		href: string
	},
	type: 'album'
}

export interface SpotPlaylistTrackObject {
	track: Pick<BasicSpotObj, 'uri'>,
	is_local: boolean
}

export interface SpotUser extends BasicSpotObj {
	display_name: string | null
}

export interface SpotArtistObject extends BasicSpotObj {
	name: string,
}

export interface SpotImageObject {
	url: string,
	height?: number | null,
	width?: number | null
}

export interface BasicSpotApiResponse {
	href: string,
	next: string | null
}

export interface SpotUserPlaylistsResponse
	extends BasicSpotApiResponse {
	items: SpotPlaylistObject[]
}

export interface MyPlaylistObject
	extends Pick<SpotPlaylistObject, 'id' | 'name'> {
	owner: {
		name: string,
		id: string
	}[],
	image?: SpotImageObject,
	tracks: number,
	type: 'album' | 'playlist'
}

export interface MyUserAPIRouteResponse {
	next: number | null,
	playlists: MyPlaylistObject[]
}

export interface getUserPlaylistsApiRequest
	extends Omit<NextApiRequest, 'query'> {
	query: { page: string }
}

export interface getSpecificPlaylistApiRequest
	extends Omit<NextApiRequest, 'query'> {
	query: {
		id: string,
		type: 'album' | 'playlist'
	}
}

export type ActionType = 'adu' | 'odu' | 'otu' | 'bu' | 'stu'

export interface createDiffPlaylistApiRequest extends NextApiRequest {
	body: {
		target: MyPlaylistObject,
		differ: MyPlaylistObject,
		type: 'adu' | 'odu' | 'otu' | 'bu' | 'stu'
	}
}

/*
	'adu' === 'add differ's uniques' / 'keep the target but add everything unique from the differ'
	'odu' === 'only differ's uniques' / 'delete everything except what's unique to the differ'
	'otu' === 'only target's uniques' / 'delete everything except what's unique to the target'
	'bu' === 'both uniques' / 'delete all similarities but keep all differences'
	'stu' === 'keep only similarities'
*/

export interface SpotPlaylistTracksResponse extends BasicSpotApiResponse {
	total: number,
	items: SpotPlaylistTrackObject[]
}

export interface SpotAlbumTracksResponse extends BasicSpotApiResponse {
	total: number,
	items: {
		uri: string
	}[]
}

export interface differInternalPlaylistPromise {
	total: number,
	completed: number,
	items: Set<string>,
}

export interface differRouteResponse {
	part: string[],
	playlist: MyPlaylistObject
}

export interface differInternalAddPromise {
	total: number,
	completed: number
}
