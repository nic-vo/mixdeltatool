import redisClient from './client';

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

const createEntry = async (params: {
	prefix: string;
	ip: string;
	rollingLimit: number;
	rollingDecaySeconds: number;
}) => {
	const { prefix, ip, rollingLimit, rollingDecaySeconds } = params;
	await redisClient().set(
		`${prefix}-${ip}`,
		`1 ${Math.ceil(Date.now() / 1000)}`,
		{ ex: rollingLimit * rollingDecaySeconds * 5 }
	);
};

export default async function checkAndUpdateEntry(params: {
	prefix: string;
	ip: string;
	rollingLimit: number;
	rollingDecaySeconds: number;
}) {
	const { prefix, ip, rollingDecaySeconds, rollingLimit } = params;
	const current = (await redisClient().get(`${prefix}-${ip}`)) as string | null;
	if (current === null) {
		await createEntry({
			prefix,
			ip,
			rollingDecaySeconds,
			rollingLimit,
		});
		return null;
	}

	const now = Math.floor(Date.now() / 1000);
	const [tokensUsed, lastUpdate] = current
		.split(' ')
		.map((str) => parseInt(str));
	const recoveredTokens = Math.floor((now - lastUpdate) / rollingDecaySeconds);
	const newTokens = Math.max(tokensUsed - recoveredTokens + 1, 1);
	await redisClient().set(
		`${prefix}-${ip}`,
		`${newTokens} ${Math.floor(Date.now() / 1000)}`,
		{
			ex:
				newTokens * rollingDecaySeconds +
				2 * rollingDecaySeconds * rollingLimit,
		}
	);
	return (newTokens - rollingLimit) * rollingDecaySeconds;
}
