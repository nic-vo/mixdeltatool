import mongoosePromise, { Session } from '@lib/database/mongoose';
import { checkAndUpdateEntry } from '@lib/database/redis/ratelimiting';

import { CustomError, RateError } from '@lib/errors';
import { NextApiRequest, NextApiResponse } from 'next';

const RATE_LIMIT_PREFIX = 'DOS';
const RATE_LIMIT_ROLLING_LIMIT = 3;
const RATE_LIMIT_DECAY_SECONDS = 60;

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (process.env.GLOBAL_SAFETY === 'ON')
		return res.status(404).json({ message: 'Error' });
	const { obfus } = req.query;
	if (obfus !== process.env.SESSION_CRON_ROUTE)
		return res.status(404).json({ message: 'Not found' });
	if (req.headers.authorization !== process.env.SESSION_CRON_SECRET)
		return res.status(404).json({ message: 'Not found' });
	res.status(200).json({ message: 'Beginning to clear' });
	try {
		const incomingIp = req.headers['x-real-ip'];
		if (!incomingIp)
			throw new CustomError(500, 'Internal Error');
		const ip = Array.isArray(incomingIp) ? incomingIp[0] : incomingIp;
		const rateLimit = await checkAndUpdateEntry({
			ip,
			prefix: RATE_LIMIT_PREFIX,
			rollingLimit: RATE_LIMIT_ROLLING_LIMIT,
			rollingDecaySeconds: RATE_LIMIT_DECAY_SECONDS
		});

		if (rateLimit !== null)
			throw new RateError(rateLimit);
		await mongoosePromise();
		const now = new Date(Date.now() - (1000 * 60 * 60));
		const deleted = await Session.deleteMany(
			{ expires: { $lt: now } }
		).exec();
		console.log(deleted);
	}
	catch { }
	return;
}
