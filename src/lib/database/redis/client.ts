import { Redis } from '@upstash/redis';

const url = process.env.REDIS_EAST_URL;
const token = process.env.REDIS_EAST_TOKEN;

if (!url || !token) throw new Error('Missing redis info');

const redisClient = new Redis({ url, token });

export default redisClient;
