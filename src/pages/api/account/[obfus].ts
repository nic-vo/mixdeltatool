import { getServerSession } from 'next-auth';
import { sessionDeleter, userDeleter } from '@/lib/auth/accountDeletion';
import { authOptions } from '@/lib/auth/options';
import { checkAndUpdateEntry } from '@/lib/database/redis/ratelimiting';

import { AuthError, CustomError, RateError } from '@/lib/errors';
import { NextApiRequest, NextApiResponse } from 'next';
import { AUTH_WINDOW, GLOBAL_EXECUTION_WINDOW } from '@/consts/spotify';

const RATE_LIMIT_PREFIX = 'DUA';
const RATE_LIMIT_ROLLING_LIMIT = 10;
const RATE_LIMIT_DECAY_SECONDS = 10;

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (process.env.GLOBAL_SAFETY === 'ON')
		return res.status(404).json({ message: 'Error' });
	const { obfus } = req.query;
	if (obfus !== process.env.NEXT_PUBLIC_ACCOUNT_ROUTE_OBFUS)
		return res.status(404).json({ message: 'Not found' });
	if (req.method !== 'GET')
		return res.status(405).json({ message: 'GET only' });

	const globalTimeoutMs = Date.now() + GLOBAL_EXECUTION_WINDOW;
	const globalTimeout = setTimeout(() => {
		return res.status(504).json({ message: 'Server timed out' });
	}, GLOBAL_EXECUTION_WINDOW);
	const authTimeout = setTimeout(() => {
		clearTimeout(globalTimeout);
		return res.status(504).json({ message: 'Server timed out' });
	}, AUTH_WINDOW);

	let session;
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

		session = await getServerSession(req, res, authOptions);
		if (session === null || session === undefined) throw new AuthError();
		clearTimeout(authTimeout);
		await userDeleter(session.user.id);
		clearTimeout(globalTimeout);
		res.status(200).json({ message: 'Success' });
		// Hopefully this returns status to user but continues execution of handler
	} catch (e: any) {
		clearTimeout(authTimeout);
		clearTimeout(globalTimeout);
		if (e.status === 429) res.setHeader('Retry-After', e.retryTime);
		return res
			.status(e.status ? e.status : 500)
			.json({ message: e.message ? e.message : 'Unknown error' });
	}

	// Handle session deletion after user and account deletion;
	const postTimeout = setTimeout(() => {
		console.log(`Timeout deleting sessions for ${session!.user.id}`);
		return null;
	}, globalTimeoutMs - Date.now());

	try {
		await sessionDeleter(session.user.id);
	} catch (e: any) {
		const message = e.message
			? e.message
			: `Error deleting sessions for ${session.user.id}`;
		console.log(message);
	}
	clearTimeout(postTimeout);
	return null;
}
