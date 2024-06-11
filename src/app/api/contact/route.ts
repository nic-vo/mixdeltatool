import {
	addNewMessage,
	checkExistingMessages,
	hCaptchaPromise,
	contactBodyParser,
} from './_lib';
import checkAndUpdateEntry from '@/lib/database/redis/ratelimiting';
import { handlerWithTimeout } from '@/lib/misc/helpers';
import {
	CreatedResponse,
	FetchErrorResponse,
	ForbiddenResponse,
	MalformedResponse,
	RateLimitResponse,
	ServerErrorResponse,
} from '@/lib/returners';

import { NextRequest } from 'next/server';

const RATE_LIMIT_PREFIX = 'SCF';
const RATE_LIMIT_ROLLING_LIMIT = 5;
const RATE_LIMIT_DECAY_SECONDS = 30;

export const maxDuration = 30;

export const POST = handlerWithTimeout(
	maxDuration,
	async (req: NextRequest) => {
		const { ip } = req;
		try {
			if (!ip) return ServerErrorResponse();
			const rateLimit = await checkAndUpdateEntry({
				ip,
				prefix: RATE_LIMIT_PREFIX,
				rollingLimit: RATE_LIMIT_ROLLING_LIMIT,
				rollingDecaySeconds: RATE_LIMIT_DECAY_SECONDS,
			});
			if (rateLimit !== null) return RateLimitResponse(rateLimit);
		} catch {
			return FetchErrorResponse(
				'There was an error with our servers. Try again'
			);
		}
		let body;
		try {
			body = contactBodyParser.parse(JSON.parse(await req.json()));
		} catch (e: any) {
			return MalformedResponse();
		}

		// Rate limit via checking how many msgs from ip exist in database
		// and hcaptcha
		let canAddNew, _;
		try {
			[canAddNew, _] = await Promise.all([
				checkExistingMessages(ip),
				hCaptchaPromise(body['h-captcha-response']),
			]);
			if (!canAddNew) return ForbiddenResponse();

			const { name, message } = body;
			await addNewMessage({ ip, name, message });
		} catch {
			return FetchErrorResponse(`Couldn't process your info`);
		}

		return CreatedResponse('Your message has been received.');
	}
);
