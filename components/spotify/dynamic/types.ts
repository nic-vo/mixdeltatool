import { MySpotifyPlaylistObject } from '@components/spotify/types'

export interface myContext {
	playlists: MySpotifyPlaylistObject[] | null,
	loading: boolean,
	error: string | null,
	getPlaylistsHandler: () => Promise<null>
};
