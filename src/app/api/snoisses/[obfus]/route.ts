import mongoosePromise, { Session } from '@/lib/database/mongoose';
import checkAndUpdateEntry from '@/lib/database/redis/ratelimiting';
import { handlerWithTimeoutAndAuth } from '@/lib/misc/helpers';
import {
	CreatedResponse,
	FetchErrorResponse,
	NotFoundResponse,
	RateLimitResponse,
	ServerErrorResponse,
} from '@/lib/returners';
import { OPTIONS } from '../../_lib';

import { NextAuthRequest } from 'next-auth/lib';
import { AppRouteHandlerFnContext } from 'next-auth/lib/types';

const RATE_LIMIT_PREFIX = 'DOS';
const RATE_LIMIT_ROLLING_LIMIT = 3;
const RATE_LIMIT_DECAY_SECONDS = 60;

export const maxDuration = 30;

export { OPTIONS };

export const POST = handlerWithTimeoutAndAuth(
	maxDuration,
	async (req: NextAuthRequest, { params }: AppRouteHandlerFnContext) => {
		if (
			process.env.GLOBAL_SAFETY === 'ON' ||
			!params ||
			params['obfus'] !== process.env.SESSION_CRON_ROUTE ||
			req.headers.get('Authorization') !== process.env.SESSION_CRON_SECRET
		)
			return NotFoundResponse();

		const { ip } = req;
		if (!ip) return ServerErrorResponse();
		try {
			const rateLimit = await checkAndUpdateEntry({
				ip,
				prefix: RATE_LIMIT_PREFIX,
				rollingLimit: RATE_LIMIT_ROLLING_LIMIT,
				rollingDecaySeconds: RATE_LIMIT_DECAY_SECONDS,
			});
			if (rateLimit !== null) return RateLimitResponse(rateLimit);
		} catch {
			return FetchErrorResponse('There was an error');
		}

		try {
			await mongoosePromise();
			const now = new Date(Date.now() - 1000 * 60 * 60);
			Session.deleteMany({
				expires: { $lt: now },
			}).exec();
			// const deleted = await Session.deleteMany({
			// 	expires: { $lt: now },
			// }).exec();
			// console.log(deleted);
		} catch {
			return ServerErrorResponse('There was an error with our servers');
		}
		return CreatedResponse('Initialized');
	}
);
