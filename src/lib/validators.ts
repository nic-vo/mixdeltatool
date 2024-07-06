import { z } from 'zod';

export const pagedResponseParser = z.object({
	href: z.string().url(),
	next: z.string().url().nullable(),
});

// For get specific playlist
export const idParamParser = z
	.string()
	.length(22)
	.regex(/^[A-Za-z0-9]{22}$/);

const basicSpotObjectParser = z.object({
	id: z.string(),
	uri: z.string(),
	href: z.string().url(),
});

export const userDetailsParser = basicSpotObjectParser
	.omit({ uri: true })
	.extend({
		display_name: z.string().nullable(),
	});

const artistObjectParser = basicSpotObjectParser.omit({ uri: true }).extend({
	name: z.string(),
});

const spotImageObjectParser = z.object({
	url: z.string().url(),
	height: z.number().int().nullable(),
	width: z.number().int().nullable(),
});

export const playlistObjectParser = basicSpotObjectParser.extend({
	images: z.nullable(z.array(spotImageObjectParser)),
	name: z.string(),
	owner: userDetailsParser,
	tracks: z.object({ total: z.number().int().gte(0) }),
	type: z.literal('playlist'),
});
export type SpotPlaylistObject = z.infer<typeof playlistObjectParser>;

export const spotAlbumObjectParser = basicSpotObjectParser.extend({
	artists: z.array(artistObjectParser),
	total_tracks: z.number().int().gte(0),
	images: z.array(spotImageObjectParser),
	name: z.string(),
	type: z.literal('album'),
});
export type SpotAlbumObject = z.infer<typeof spotAlbumObjectParser>;

// The shape expected by the API; everything must be coerced to this
export const myPlaylistObjectParser = basicSpotObjectParser
	.pick({ id: true })
	.extend({
		name: z.string(),
		owner: z.array(z.object({ name: z.string().nullable(), id: z.string() })),
		image: z.nullable(spotImageObjectParser),
		tracks: z.number().int().gte(0),
		type: z.enum(['album', 'playlist']),
	});
export type MyPlaylistObject = z.infer<typeof myPlaylistObjectParser>;

export const diffBodyParser = z
	.object({
		target: myPlaylistObjectParser,
		differ: myPlaylistObjectParser,
		type: z.enum(['adu', 'odu', 'otu', 'bu', 'stu']),
		newName: z.string().max(150).nullable(),
		newDesc: z.string().max(600).nullable(),
		keepImg: z.boolean(),
	})
	.strict();

export const userPlaylistResponseParser = pagedResponseParser.extend({
	items: z.array(playlistObjectParser),
});
