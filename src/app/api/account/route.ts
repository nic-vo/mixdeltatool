import { sessionDeleter, userDeleter } from '@/lib/auth/accountDeletion';
import badResponse, { BasicSuccessResponse } from '@/lib/returners';
import { handlerWithTimeoutAndAuth } from '@/lib/misc/helpers';

import { NextAuthRequest } from 'next-auth/lib';

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

		try {
			await userDeleter(req.auth.user.id);
		} catch {
			// Catch network failure
			return badResponse(502, {
				message: 'There was an error processing your information',
			});
		}
		sessionDeleter(req.auth.user.id); // TODO: Possibly race this
		return BasicSuccessResponse('Your account has been deleted');
	}
);
