export interface SpotifyUserPlaylistsResponse {
	href: string,
	limit: number
	offset: number,
	previous: null | string,
	next: null | string,
	total: number
	items: SpotifyPlaylistObject[]
}

export interface SpotifyPlaylistObject {
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
	tracks: { href: string, total: number },
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

export interface MySpotifyPlaylistObject extends
	Pick<SpotifyPlaylistObject, 'id' | 'name' | 'owner' | 'tracks'> {
	image: SpotifyImageObject
}

export interface MySpotifyAPIRouteResponse extends
	Pick<SpotifyUserPlaylistsResponse, 'next' | 'total'> {
	playlists: MySpotifyPlaylistObject[]
}
