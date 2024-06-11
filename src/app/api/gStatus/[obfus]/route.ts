import { setNewGlobalStatus } from '@/lib/database/mongoose';
import checkAndUpdateEntry from '@/lib/database/redis/ratelimiting';
import { OPTIONS } from '../../_lib';
import { handlerWithTimeout } from '@/lib/misc/helpers';
import {
	CreatedResponse,
	MalformedResponse,
	NotFoundResponse,
	RateLimitResponse,
	ServerErrorResponse,
} from '@/lib/returners';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';

import { NextRequest } from 'next/server';
import { AppRouteHandlerFnContext } from 'next-auth/lib/types';

const RATE_LIMIT_PREFIX = 'GSU';
const RATE_LIMIT_ROLLING_LIMIT = 5;
const RATE_LIMIT_DECAY_SECONDS = 30;

const validator = z.object({
	token: z.string().min(1).max(100),
	statusType: z.enum(['ok', 'concern', 'severe']),
	status: z.string().min(1),
});

export const maxDuration = 20;

export { OPTIONS };

export const POST = handlerWithTimeout(
	maxDuration,
	async (req: NextRequest, { params }: AppRouteHandlerFnContext) => {
		if (process.env.GLOBAL_SAFETY === 'ON') return NotFoundResponse();
		if (
			!params ||
			params['obfus'] !== process.env.NEXT_PUBLIC_GLOBAL_STATUS_UPDATE_ROUTE
		)
			return NotFoundResponse();

		let body;
		try {
			body = validator.parse(await req.json());
		} catch {
			return MalformedResponse();
		}
		const { status, statusType, token } = body;
		if (token !== process.env.NEXT_PUBLIC_GLOBAL_STATUS_UPDATE_SECRET)
			return NotFoundResponse();

		try {
			const { ip } = req;
			if (!ip) return ServerErrorResponse('IP was missing somehow');
			const rateLimit = await checkAndUpdateEntry({
				ip,
				prefix: RATE_LIMIT_PREFIX,
				rollingLimit: RATE_LIMIT_ROLLING_LIMIT,
				rollingDecaySeconds: RATE_LIMIT_DECAY_SECONDS,
			});
			if (rateLimit !== null) return RateLimitResponse(rateLimit);
		} catch {
			return ServerErrorResponse('Error rate limiting IP');
		}

		await setNewGlobalStatus({ status, statusType });
		try {
			revalidatePath('/');
			revalidatePath('/spotify');
		} catch {
			return ServerErrorResponse(
				'There was an error revalidating the cache for the paths'
			);
		}
		return CreatedResponse('Status updated');
	}
);
