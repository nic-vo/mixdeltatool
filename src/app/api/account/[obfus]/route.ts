import { auth } from '@/auth';
import { sessionDeleter, userDeleter } from '@/lib/auth/accountDeletion';
import checkAndUpdateEntry from '@/lib/database/redis/ratelimiting';
import {
	BasicSuccessResponse,
	FetchErrorResponse,
	NotFoundResponse,
	RateLimitResponse,
	ServerErrorResponse,
	UnAuthorizedResponse,
} from '@/lib/returners';
import { handlerWithTimeoutAndAuth } from '@/lib/misc/helpers';

import { NextAuthRequest } from 'next-auth/lib';
import { AppRouteHandlerFnContext } from 'next-auth/lib/types';

const RATE_LIMIT_PREFIX = 'DUA';
const RATE_LIMIT_ROLLING_LIMIT = 10;
const RATE_LIMIT_DECAY_SECONDS = 10;

/*

This handler allows people to delete their accounts

*/

export const maxDuration = 55;

export const POST = handlerWithTimeoutAndAuth(
	maxDuration,
	async (req: NextAuthRequest, { params }: AppRouteHandlerFnContext) => {
		if (process.env.GLOBAL_SAFETY === 'ON') return NotFoundResponse();
		// Check if correct route
		if (
			!params ||
			params['obfus'] !== process.env.NEXT_PUBLIC_ACCOUNT_ROUTE_OBFUS
		)
			return NotFoundResponse();

		try {
			const { ip } = req;
			if (!ip) return ServerErrorResponse();
			const rateLimit = await checkAndUpdateEntry({
				ip,
				prefix: RATE_LIMIT_PREFIX,
				rollingLimit: RATE_LIMIT_ROLLING_LIMIT,
				rollingDecaySeconds: RATE_LIMIT_DECAY_SECONDS,
			});
			if (rateLimit !== null) return RateLimitResponse(rateLimit);
		} catch {
			// Catch network failure
			return ServerErrorResponse();
		}
		if (!req.auth) return UnAuthorizedResponse();

		try {
			await userDeleter(req.auth.user.id);
		} catch {
			// Catch network failure
			return FetchErrorResponse(
				'There was an error processing your information'
			);
		}
		sessionDeleter(req.auth.user.id);
		return BasicSuccessResponse();
	}
);
