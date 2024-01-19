import { CustomError } from '@lib/errors';
import { Redis } from '@upstash/redis'

const url = process.env.REDIS_WEST_URL;
const token = process.env.REDIS_WEST_TOKEN;

if (!url || !token)
	throw new CustomError(500, 'There was an error authenticating your request');

const redisClient = new Redis({ url, token });

export default redisClient;
