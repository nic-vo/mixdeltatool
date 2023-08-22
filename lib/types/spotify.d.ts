import type { DefaultUser } from 'next-auth'
import type { AdapterAccount } from 'next-auth/adapters'
import type { SpotifyProfile } from 'next-auth/providers/spotify'

export interface SpotifyUserPlaylistsResponse {
	collaborative: boolean,
	description: string | null,
	external_urls: string[],
	href: string,
	id: string,
	images: SpotifyImageObject[]
	name: string,
	owner: SpotifyUser,
	public: boolean,
	snapshot_id: string,
	tracks: {
		href: string,
		total: number
	},
	type: string,
	uri: string
}

export interface SpotifyImageObject {
	url: string,
	height: number,
	width: number
}

export interface SpotifyUser {
	external_urls: string[],
	followers: { href: null, total: number },
	href: string,
	id: string,
	type: string,
	uri: string,
	display_name: string | null
}

export interface MySpotifyPlaylistResponse {
	id: string,
	image: SpotifyImageObject,
	name: string,
	owner: SpotifyUser,
	tracks: {
		href: string,
		total: number
	},
	href: string
}
