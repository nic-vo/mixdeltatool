import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';

import { sessionDeleter, userDeleter } from '@/lib/auth/accountDeletion';
import { authOptions } from '@/lib/auth/options';
import { checkAndUpdateEntry } from '@/lib/database/redis/ratelimiting';

import {
	AuthError,
	CustomError,
	FetchError,
	NotFoundError,
	RateError,
	ServerError,
	TimeoutError,
} from '@/lib/errors';
import { AUTH_WINDOW, GLOBAL_EXECUTION_WINDOW } from '@/consts/spotify';
import { NextAuthRequest } from 'next-auth/lib';

const RATE_LIMIT_PREFIX = 'DUA';
const RATE_LIMIT_ROLLING_LIMIT = 10;
const RATE_LIMIT_DECAY_SECONDS = 10;

/*

This handler allows people to delete their accounts

*/

export const POST = auth(async function POST(req: NextAuthRequest) {
	try {
		if (process.env.GLOBAL_SAFETY === 'ON') throw new NotFoundError();

		// Check if correct route
		if (
			req.nextUrl.pathname.split('/').pop() !==
			process.env.NEXT_PUBLIC_ACCOUNT_ROUTE_OBFUS
		)
			throw new NotFoundError();

		const globalTimeout = setTimeout(() => {
			throw new TimeoutError();
		}, GLOBAL_EXECUTION_WINDOW);
		const authTimeout = setTimeout(() => {
			throw new TimeoutError();
		}, AUTH_WINDOW);

		try {
			const { ip } = req;
			if (!ip) throw new CustomError(500, 'Internal Error');
			const rateLimit = await checkAndUpdateEntry({
				ip,
				prefix: RATE_LIMIT_PREFIX,
				rollingLimit: RATE_LIMIT_ROLLING_LIMIT,
				rollingDecaySeconds: RATE_LIMIT_DECAY_SECONDS,
			});
			if (rateLimit !== null) throw new RateError(rateLimit);
		} catch (e: any) {
			clearTimeout(authTimeout);
			clearTimeout(globalTimeout);
			// Catch the RateError and re-throw
			if (e.status === 429) throw e;
			throw new ServerError();
		}

		if (!req.auth) throw new AuthError();
		clearTimeout(authTimeout);

		try {
			await userDeleter(req.auth.user.id);
		} catch {
			throw new FetchError('There was an error processing your information');
		}
		clearTimeout(globalTimeout);
		return NextResponse.json({ message: 'Success' }, { status: 201 });
	} catch (e: any) {
		return NextResponse.json(
			{ message: e.message ?? 'Server error' },
			{ status: e.status ?? 500 }
		);
	}
});
