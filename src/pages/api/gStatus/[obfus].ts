import { setNewGlobalStatus, CORSGet } from '@/lib/database/mongoose';
import { checkAndUpdateEntry } from '@/lib/database/redis/ratelimiting';

import { CustomError, RateError } from '@/lib/errors';
import { NextApiRequest, NextApiResponse } from 'next';

const RATE_LIMIT_PREFIX = 'GSU';
const RATE_LIMIT_ROLLING_LIMIT = 5;
const RATE_LIMIT_DECAY_SECONDS = 30;

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (process.env.GLOBAL_SAFETY === 'ON')
		return res.status(404).json({ message: 'Error' });
	const { obfus } = req.query;

	res.setHeader('Access-Control-Allow-Credentials', 'true');
	res.setHeader('Access-Control-Allow-Origin', CORSGet(req));
	res.setHeader('Access-Control-Allow-Methods', 'OPTIONS,POST');
	res.setHeader(
		'Access-Control-Allow-Headers',
		'Accept, Accept-Version, Content-Length, Content-Type, Date, Accept-Encoding'
	);

	if (req.method === 'OPTIONS') return res.status(200).end();
	if (req.method !== 'POST')
		return res.status(404).json({ message: 'Wrong method' });
	if (obfus !== process.env.NEXT_PUBLIC_GLOBAL_STATUS_UPDATE_ROUTE)
		return res.status(404).json({ message: 'Not found' });

	const { status, statusType, token } = req.body;
	if (!token || token !== process.env.NEXT_PUBLIC_GLOBAL_STATUS_UPDATE_SECRET)
		return res.status(404).json({ message: 'Not found' });
	if (!status || !statusType)
		return res.status(400).json({ message: 'Status needed' });

	try {
		const incomingIp = req.headers['x-real-ip'];
		if (!incomingIp) throw new CustomError(500, 'Internal Error');
		const ip = Array.isArray(incomingIp) ? incomingIp[0] : incomingIp;
		const rateLimit = await checkAndUpdateEntry({
			ip,
			prefix: RATE_LIMIT_PREFIX,
			rollingLimit: RATE_LIMIT_ROLLING_LIMIT,
			rollingDecaySeconds: RATE_LIMIT_DECAY_SECONDS,
		});

		if (rateLimit !== null) throw new RateError(rateLimit);

		await setNewGlobalStatus({ status, statusType });
		try {
			await Promise.all([res.revalidate('/'), res.revalidate('/spotify')]);
		} catch {
			throw new CustomError(
				500,
				'There was an error pushing status to the page'
			);
		}
	} catch (e: any) {
		return res
			.status(e.status || 500)
			.json({ message: e.message || 'Unknown error' });
	}
	res.status(200).json({ message: 'Status updated' });
	return;
}
