import {
	addNewMessage,
	checkExistingMessages,
	hCaptchaPromise,
	contactBodyParser,
} from './_lib';
import { handlerWithTimeout } from '@/lib/misc/helpers';
import badResponse from '@/lib/returners';

import { NextRequest } from 'next/server';

const RATE_LIMIT_PREFIX = 'SCF';
const RATE_LIMIT_ROLLING_LIMIT = 5;
const RATE_LIMIT_DECAY_SECONDS = 30;

export const maxDuration = 30;

export const POST = handlerWithTimeout(
	{
		maxDuration,
		rateLimit: {
			RATE_LIMIT_PREFIX,
			RATE_LIMIT_DECAY_SECONDS,
			RATE_LIMIT_ROLLING_LIMIT,
		},
	},
	async (req: NextRequest) => {
		// Validate body first since no database call
		let body;
		try {
			body = contactBodyParser.parse(JSON.parse(await req.json()));
		} catch {
			return badResponse(400);
		}

		const { ip } = req;
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
