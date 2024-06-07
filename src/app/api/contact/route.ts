import {
	addNewMessage,
	checkExistingMessages,
	hCaptchaPromise,
} from '@/lib/contact/helpers';
import { contactBodyParser } from '@/lib/contact/validators';
import { checkAndUpdateEntry } from '@/lib/database/redis/ratelimiting';
import {
	CustomError,
	ForbiddenError,
	MalformedError,
	RateError,
} from '@/lib/errors';

import { NextRequest, NextResponse } from 'next/server';

const RATE_LIMIT_PREFIX = 'SCF';
const RATE_LIMIT_ROLLING_LIMIT = 5;
const RATE_LIMIT_DECAY_SECONDS = 30;

export async function POST(req: NextRequest) {
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

		let body;
		try {
			body = contactBodyParser.parse(JSON.parse(await req.json()));
		} catch (e: any) {
			throw new MalformedError();
		}

		if (!body) throw new CustomError(500, 'Internal error.');
		// Rate limit via checking how many msgs from ip exist in database
		// and hcaptcha
		let canAddNew, _;
		try {
			[canAddNew, _] = await Promise.all([
				checkExistingMessages(ip),
				hCaptchaPromise(body['h-captcha-response']),
			]);
		} catch {
			throw new CustomError(500, 'Server error');
		}
		if (!canAddNew) throw new ForbiddenError(`You're not allowed to do that.`);

		const { name, message } = body;
		await addNewMessage({ ip, name, message });

		return NextResponse.json(
			{ message: 'Your message has been received' },
			{ status: 201 }
		);
	} catch (e: any) {
		return NextResponse.json(
			{ message: e.message ?? 'Unknown Error' },
			e.status && e.status === 429
				? { status: e.status, headers: { 'Retry-After': '5' } }
				: { status: e.status ?? 500 }
		);
	}
}
