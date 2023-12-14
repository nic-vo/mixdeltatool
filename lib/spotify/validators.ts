import { SPOT_PLAYLIST_PAGE_LIMIT } from '@consts/spotify';
import { z } from 'zod';

const pageQueryParser = z.object({
	page: z.coerce.number().int().gte(0).lte(SPOT_PLAYLIST_PAGE_LIMIT)
}).strict();


const idParamParser = z.string().length(22).regex(/^[A-Za-z0-9]{22}$/);
const typeParamParser = z.enum(['playlist', 'album']);

const specificQueryParser = z.object({
	id: idParamParser,
	type: typeParamParser
}).strict();

const playlistIdTypeParser = z.object({
	id: idParamParser,
	type: typeParamParser,
	name: z.string(),
	owner: z.string()
}).strict();

const diffBodyParser = z.object({
	target: playlistIdTypeParser,
	differ: playlistIdTypeParser,
	type: z.enum(['adu', 'odu', 'otu', 'bu', 'stu'])
}).strict();

const basicSpotObjectParser = z.object({
	id: z.string(),
	uri: z.string(),
	href: z.string()
});

const basicSpotAPIResponseParser = z.object({
	href: z.string().url(),
	next: z.nullable(z.string().url())
});

const spotUserObjectParser = basicSpotObjectParser.extend({
	display_name: z.nullable(z.string())
});

const spotArtistObjectParser = basicSpotObjectParser.extend({
	name: z.string()
});

const spotImageObjectParser = z.object({
	url: z.string().url(),
	height: z.nullable(z.number().int()),
	width: z.nullable(z.number().int())
});

const spotPlaylistObjectParser = basicSpotObjectParser.extend({
	collaborative: z.boolean(),
	description: z.nullable(z.string()),
	images: z.array(spotImageObjectParser),
	name: z.string(),
	owner: spotUserObjectParser,
	public: z.boolean(),
	snapshot_id: z.string(),
	tracks: z.object({ href: z.string().url(), total: z.number().int() }),
	type: z.literal('playlist')
});

const spotAlbumObjectParser = basicSpotObjectParser.extend({
	album_type: z.enum(['album', 'single', 'compilation']),
	artists: z.array(spotArtistObjectParser),
	total_tracks: z.number().int(),
	available_markets: z.array(z.string()),
	external_urls: z.object({ spotify: z.string() }),
	images: z.array(spotImageObjectParser),
	name: z.string(),
	release_date: z.string(),
	release_date_precision: z.enum(['year', 'month', ' day']),
	tracks: z.object({ href: z.string().url() }),
	type: z.literal('album')
});

const userPlaylistResponseParser = basicSpotAPIResponseParser.extend({
	items: z.array(spotPlaylistObjectParser)
});

export {
	pageQueryParser,
	specificQueryParser,
	playlistIdTypeParser,
	diffBodyParser,
	userPlaylistResponseParser,
	spotPlaylistObjectParser,
	spotAlbumObjectParser,
	spotUserObjectParser
};
