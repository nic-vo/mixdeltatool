import { setNewGlobalStatus } from '@/lib/database/mongoose';
import { OPTIONS, badResponse } from '@/lib/route_helpers';
import { handlerWithTimeout } from '@/lib/misc/wrappers';
import { z } from 'zod';
import { revalidateTag } from 'next/cache';

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

export const PUT = handlerWithTimeout(
	{
		maxDuration,
		rateLimit: {
			RATE_LIMIT_DECAY_SECONDS,
			RATE_LIMIT_PREFIX,
			RATE_LIMIT_ROLLING_LIMIT,
		},
	},
	async (req: NextRequest, { params }: AppRouteHandlerFnContext) => {
		if (
			!params ||
			params['obfus'] !== process.env.NEXT_PUBLIC_GLOBAL_STATUS_UPDATE_ROUTE
		)
			return badResponse(404);

		let body;
		try {
			body = validator.parse(await req.json());
		} catch {
			return badResponse(400);
		}
		const { status, statusType, token } = body;
		if (token !== process.env.NEXT_PUBLIC_GLOBAL_STATUS_UPDATE_SECRET)
			return badResponse(404);

		const dbCall = await setNewGlobalStatus({ status, statusType });
		if (!dbCall.ok) return dbCall;

		revalidateTag('internalGlobalStatus');

		return Response.json({ message: 'Status updated' }, { status: 201 });
	}
);
