import { MySpotifyPlaylistObject } from '@components/spotify/types'

export interface myContext {
	userPlaylists: MySpotifyPlaylistObject[] | null,
	customPlaylists: MySpotifyPlaylistObject[] | null,
	loading: boolean,
	error: string | null,
	getUserPlaylistsHandler: () => Promise<null>
};
