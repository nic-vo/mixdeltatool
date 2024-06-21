import mongoosePromise, { Session } from '@/lib/database/mongoose';
import { handlerWithTimeoutAndAuth } from '@/lib/misc/helpers';
import badResponse from '@/lib/route_helpers';
import { OPTIONS } from '../../_lib';

import { NextAuthRequest } from 'next-auth/lib';
import { AppRouteHandlerFnContext } from 'next-auth/lib/types';

const RATE_LIMIT_PREFIX = 'DOS';
const RATE_LIMIT_ROLLING_LIMIT = 3;
const RATE_LIMIT_DECAY_SECONDS = 60;

export const maxDuration = 30;

export { OPTIONS };

export const DELETE = handlerWithTimeoutAndAuth(
	{
		maxDuration,
		rateLimit: {
			RATE_LIMIT_DECAY_SECONDS,
			RATE_LIMIT_PREFIX,
			RATE_LIMIT_ROLLING_LIMIT,
		},
	},
	async (req: NextAuthRequest, { params }: AppRouteHandlerFnContext) => {
		if (
			!params ||
			params['obfus'] !== process.env.SESSION_CRON_ROUTE ||
			req.headers.get('Authorization') !== process.env.SESSION_CRON_SECRET
		)
			return badResponse(404);

		if (!req.auth) return badResponse(401);

		const now = new Date(Date.now() - 1000 * 60 * 60);
		try {
			await mongoosePromise();
			await Session.deleteMany({
				expires: { $lt: now },
			}).exec();
			// const deleted = await Session.deleteMany({
			// 	expires: { $lt: now },
			// }).exec();
			// console.log(deleted);
		} catch {
			return badResponse(500, {
				message: 'There was an error with our servers',
			});
		}
		return Response.json(
			{ message: `Sessions before ${now.toLocaleString()} were deleted` },
			{ status: 200 }
		);
	}
);
