import { sessionDeleter, userDeleter } from './_lib';
import badResponse from '@/lib/route_helpers';
import { handlerWithTimeoutAndAuth } from '@/lib/misc/helpers';

import { NextAuthRequest } from 'next-auth/lib';
import { myRace } from '../spotify/create/_lib/common';

const RATE_LIMIT_PREFIX = 'DUA';
const RATE_LIMIT_ROLLING_LIMIT = 10;
const RATE_LIMIT_DECAY_SECONDS = 10;

/*

This handler allows people to delete their accounts

*/

export const maxDuration = 55;

export const DELETE = handlerWithTimeoutAndAuth(
	{
		maxDuration,
		rateLimit: {
			RATE_LIMIT_PREFIX,
			RATE_LIMIT_ROLLING_LIMIT,
			RATE_LIMIT_DECAY_SECONDS,
		},
	},
	async (req: NextAuthRequest) => {
		if (!req.auth || !req.auth.user || !req.auth.user.id)
			return badResponse(401);

		const earlyReturn = await myRace(userDeleter(req.auth.user.id), 30 * 1000);
		if (!earlyReturn.ok) return earlyReturn;

		await myRace(sessionDeleter(req.auth.user.id), 30 * 1000); // A little unsafe because 30s not guaranteed
		return Response.json(
			{ message: 'Your account has been deleted' },
			{ status: 200 }
		);
	}
);
