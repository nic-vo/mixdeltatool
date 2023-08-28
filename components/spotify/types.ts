import { NextApiRequest } from 'next';

export interface SpotPlaylistsResponse {
	href: string,
	limit: number
	offset: number,
	previous: null | string,
	next: null | string,
	total: number
}

export interface SpotUserPlaylistsResponse
	extends SpotPlaylistsResponse {
	items: SpotPlaylistObject[]
}

export interface SpotPlaylistObject {
	collaborative: boolean,
	description: string | null,
	external_urls: string[],
	href: string,
	id: string,
	images: SpotImageObject[]
	name: string,
	owner: SpotUser,
	public: boolean,
	snapshot_id: string,
	tracks: { href: string, total: number },
	type: string,
	uri: string
}

export interface SpotImageObject {
	url: string,
	height: number,
	width: number
}

export interface SpotUser {
	external_urls: string[],
	followers: { href: null, total: number },
	href: string,
	id: string,
	type: string,
	uri: string,
	display_name: string | null
}

export interface MyPlaylistObject extends
	Pick<SpotPlaylistObject, 'id' | 'name' | 'owner' | 'tracks'> {
	image: SpotImageObject
}

export interface MyUserAPIRouteResponse extends
	Pick<SpotUserPlaylistsResponse, 'next' | 'total'> {
	playlists: MyPlaylistObject[]
}

export interface getUserPlaylistsApiRequest
	extends Omit<NextApiRequest, 'query'> {
	query: { page: string }
}

export interface getSpecificPlaylistApiRequest
	extends Omit<NextApiRequest, 'query'> {
	query: { playlist: string }
}
