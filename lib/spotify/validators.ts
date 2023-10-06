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

export {
	pageQueryParser,
	specificQueryParser,
	playlistIdTypeParser,
	diffBodyParser
};
