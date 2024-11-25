import {
	addNewMessage,
	checkExistingMessages,
	hCaptchaPromise,
	contactBodyParser,
} from './_lib';
import { handlerWithTimeout } from '@/lib/route_helpers/wrappers';
import { badResponse } from '@/lib/route_helpers/responses';

import { NextRequest } from 'next/server';
import { ipAddress } from '@vercel/functions';

const rateLimit = {
	RATE_LIMIT_PREFIX: 'SCF',
	RATE_LIMIT_ROLLING_LIMIT: 5,
	RATE_LIMIT_DECAY_SECONDS: 30,
};

export const maxDuration = 30;

export const POST = handlerWithTimeout(
	{
		maxDuration,
		rateLimit,
	},
	async (req: NextRequest) => {
		// Validate body first since no database call
		let body;
		try {
			body = contactBodyParser.parse(JSON.parse(await req.json()));
		} catch {
			return badResponse(400);
		}

		const ip = ipAddress(req);
		if (!ip) return badResponse(500);

		let canAddNew, _;
		try {
			[canAddNew, _] = await Promise.all([
				checkExistingMessages(ip),
				hCaptchaPromise(body['h-captcha-response']),
			]);
			if (!canAddNew) return badResponse(403);
			const { name, message } = body;
			await addNewMessage({ ip, name, message });
		} catch {
			return badResponse(502, {
				message: `Couldn't process your information.`,
			});
		}

		return Response.json(
			{ message: 'Your message has been received.' },
			{ status: 200 }
		);
	}
);
