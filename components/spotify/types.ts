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

export interface SpotTrackObject { track: Pick<BasicSpotObj, 'uri'> }

export interface SpotUser extends BasicSpotObj {
	display_name: string | null
}

export interface SpotArtistObject
	extends Omit<SpotUser, 'display_name'> {
	name: string,
}

export interface SpotImageObject {
	url: string,
	height: number,
	width: number
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
	extends Pick<SpotPlaylistObject, 'id' | 'name' | 'owner'> {
	image: SpotImageObject,
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

export interface createDiffPlaylistApiRequest extends NextApiRequest {
	body: {
		target: { id: string, type: 'album' | 'playlist' },
		differ: { id: string, type: 'album' | 'playlist' },
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

export interface UserContextSignature {
	userPlaylists: MyPlaylistObject[] | null,
	userCurrentPage: number | null,
	userError: string | null,
	userLoading: boolean,
	clearUserPlaylistsHandler: () => null,
	getUserPlaylistsHandler: () => Promise<null>,
	updateUserPlaylistsHandler: (playlist: MyPlaylistObject) => null
};

export interface SpecificContextSignature {
	specificPlaylists: MyPlaylistObject[] | null,
	specificError: string | null,
	specificLoading: boolean,
	getSpecificPlaylistHandler: (params:
		{ id: string, type: string }
	) => Promise<null>,
	clearSpecificPlaylistsHandler: () => null,
}

export type ProviderState = MyPlaylistObject[] | null;

export interface SpotTracksResponse extends BasicSpotApiResponse {
	next: string,
	total: number,
	items: SpotTrackObject[]
}

export interface differInternalPlaylistPromise {
	partial: boolean,
	total: number,
	items: string[],
	apiNull: boolean
}

export interface differInternalAddPromise {
	partial: boolean,
	total: number
}

export interface successState {
	reasons: string[]
}
