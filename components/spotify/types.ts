import { NextApiRequest, NextApiResponse } from 'next';

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
	href: string,
	id: string,
	images: SpotImageObject[]
	name: string,
	owner: SpotUser,
	public: boolean,
	snapshot_id: string,
	tracks: { href: string, total: number },
	type: 'playlist',
	uri: string
}

export interface SpotImageObject {
	url: string,
	height: number,
	width: number
}

export interface SpotUser {
	href: string,
	id: string,
	type: string,
	uri: string,
	display_name: string | null
}

export interface MyPlaylistObject extends
	Pick<SpotPlaylistObject, 'id' | 'name' | 'owner'> {
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
	query: { id: string, type: 'album' | 'playlist' }
}
