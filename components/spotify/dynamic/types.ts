import { MyPlaylistObject } from '@components/spotify/types'

export interface myContext {
	userPlaylists: MyPlaylistObject[] | null,
	customPlaylists: MyPlaylistObject[] | null,
	loading: boolean,
	error: string | null,
	nextPage: number | null,
	getUserPlaylistsHandler: () => Promise<null>
};
