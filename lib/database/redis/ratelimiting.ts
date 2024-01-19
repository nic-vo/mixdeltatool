import { CustomError } from '@lib/errors';
import redisClient from './client';
import { printTime } from '@lib/misc';

const createEntry = async (params: {
	prefix: string,
	ip: string
}) => {
	const { prefix, ip } = params;
	try {
		await redisClient.set(`${prefix}-${ip}`,
			`1 ${Math.ceil(Date.now() / 1000)}`,
		);
	} catch {
		throw new CustomError(500, 'Create error');
	}
	return null;
}

/*

IDK if this rate limiting idea is good;
Essentially a very unforgiving rolling window.

1. First route hit: set a hit counter and a timestamp in seconds

2. Subsequent route hits: calculate how many seconds have passed
since timestamp. Divide by regen / decay rate to get how many hits have regened

3. If count - regened hits > rolling limit, 429 the client

TODO: If count hits a hard limit, IP will be added to blacklist

4. Set redis key expiry to time it would take for all hits the decay / regen

*/

const checkAndUpdateEntry = async (params: {
	prefix: string,
	ip: string,
	rollingLimit: number,
	rollingDecaySeconds: number
}) => {
	const {
		prefix,
		ip,
		rollingDecaySeconds,
		rollingLimit
	} = params;
	let returner = null;
	const start = Date.now();
	try {
		const current = await redisClient.get(`${prefix}-${ip}`) as string | null;
		printTime('First rate limit get:', start);
		if (current === null) {
			await createEntry({ prefix, ip });
			printTime('Created new rate limit:', start);
			return returner;
		} else {
			const now = Math.floor(Date.now() / 1000);
			const [history, lastUpdate] = current.split(' ')
				.map(str => parseInt(str));
			const recovered = Math.floor((now - lastUpdate) / rollingDecaySeconds);
			const newHistory = Math.max(history - recovered + 1, 1);
			if (newHistory > rollingLimit) {
				returner = (newHistory - rollingLimit) * rollingDecaySeconds;
			}
			await redisClient.set(`${prefix}-${ip}`, `${newHistory} ${now}`,
				{
					ex: (newHistory * rollingDecaySeconds) + rollingDecaySeconds
				});
			printTime('Awaited new rate limit:', start);
		}
	} catch (e: any) {
		console.log(e)
		throw new CustomError(500, 'Internal error');
	}
	return returner;
}

export {
	checkAndUpdateEntry
};
