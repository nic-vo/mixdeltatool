import { Redis } from '@upstash/redis';

export default function getRedisClient() {
	const url = process.env.REDIS_EAST_URL;
	const token = process.env.REDIS_EAST_TOKEN;

	if (!url || !token) throw new Error('Missing redis info');

	return new Redis({ url, token });
}
