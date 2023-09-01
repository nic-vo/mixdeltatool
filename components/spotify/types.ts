import { NextApiRequest } from 'next';

interface BasicSpotObj {
	id: string,
	type: string,
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
	tracks: { href: string, total: number }
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
	}
}

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

export interface SpotPlaylistsResponse {
	href: string,
	next: null | string
}

export interface SpotUserPlaylistsResponse
	extends SpotPlaylistsResponse {
	items: SpotPlaylistObject[]
}

export interface MyPlaylistObject extends
	Pick<SpotPlaylistObject, 'id' | 'name' | 'owner'> {
	image: SpotImageObject,
	tracks: number
}

export interface MyUserAPIRouteResponse extends
	Pick<SpotUserPlaylistsResponse, 'next'> {
	playlists: MyPlaylistObject[]
}

export interface getUserPlaylistsApiRequest
	extends Omit<NextApiRequest, 'query'> {
	query: { page: string }
}

export interface getSpecificPlaylistApiRequest
	extends Omit<NextApiRequest, 'query'> {
	query: { id: string, type: 'album' | 'playlist' }
}

export interface createDiffPlaylistApiRequest
	extends Omit<NextApiRequest, 'query'> {
	query: { target: string, discrim: string }
}

export interface UserPlaylistContextSignature {
	userPlaylists: MyPlaylistObject[] | null,
	userCurrentPage: number | null,
	userError: string | null,
	userLoading: boolean,
	clearUserPlaylistsHandler: () => null,
	getUserPlaylistsHandler: () => Promise<null>,
	updateUserPlaylistsHandler: () => null
};

export interface SpecificPlaylistContextSignature {
	specificPlaylists: MyPlaylistObject[] | null,
	specificError: string | null,
	specificLoading: boolean,
	getSpecificPlaylistHandler: (params: { id: string, type: string }) => Promise<null>,
	clearSpecificPlaylistsHandler: () => null,
}

export type ProviderState = MyPlaylistObject[] | null;
