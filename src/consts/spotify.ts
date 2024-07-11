import MixDeltaLogo from './mdl.jpg';
import SpotifyLogo from './Spotify_Logo_RGB_White.png';

export const SPOT_URL_BASE = 'https://api.spotify.com/v1/';
export const SPOT_PLAYLIST_PAGE_LIMIT = 49;
export const CLIENT_DIFF_TYPES = {
	stu: 'Only tracks that are in BOTH the target and differ.',
	odu: 'Tracks that exist only in the differ.',
	otu: 'Tracks that exist only in the target.',
	adu: 'The original target + anything new from the differ.',
	bu: 'Only the differences between the target and the differ; no shared.',
};

export { MixDeltaLogo, SpotifyLogo };
