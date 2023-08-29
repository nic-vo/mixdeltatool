import { MyPlaylistObject } from '@components/spotify/types'

export interface PlaylistSignature {
	userPlaylists: MyPlaylistObject[] | null,
	specificPlaylists: MyPlaylistObject[] | null,
	userLoading: boolean,
	specificLoading: boolean,
	userError: string | null,
	specificError: string | null,
	userCurrentPage: number | null,
	clearUserPlaylistsHandler: () => null,
	getUserPlaylistsHandler: () => Promise<null>,
	getSpecificPlaylistHandler: (params: { id: string , type: string }) => Promise<null>,
	clearSpecificPlaylistsHandler: () => null
};

export type ProviderState = MyPlaylistObject[] | null;
