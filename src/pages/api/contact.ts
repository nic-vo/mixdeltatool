import {
	addNewMessage,
	checkExistingMessages,
	hCaptchaPromise
} from '@lib/contact/helpers';
import { contactBodyParser } from '@lib/contact/validators';
import { checkAndUpdateEntry } from '@lib/database/redis/ratelimiting';

import { CustomError, ForbiddenError, MalformedError, RateError } from '@lib/errors';
import type { NextApiRequest, NextApiResponse } from 'next';

const RATE_LIMIT_PREFIX = 'SCF';
const RATE_LIMIT_ROLLING_LIMIT = 5;
const RATE_LIMIT_DECAY_SECONDS = 30;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	try {
		const forHeader = req.headers['x-forwarded-for'];
		if (!forHeader)
			throw new CustomError(500, 'Internal Error');
		const ip = Array.isArray(forHeader) ? forHeader[0] : forHeader;
		const rateLimit = await checkAndUpdateEntry({
			ip,
			prefix: RATE_LIMIT_PREFIX,
			rollingLimit: RATE_LIMIT_ROLLING_LIMIT,
			rollingDecaySeconds: RATE_LIMIT_DECAY_SECONDS
		});
		if (rateLimit !== null)
			throw new RateError(rateLimit);

		let body;
		try {
			body = contactBodyParser.parse(JSON.parse(req.body));
		} catch (e: any) {
			throw new MalformedError();
		}

		if (body === undefined) throw new CustomError(500, 'Internal error.');
		// Rate limit via checking how many msgs from ip exist in database
		// and hcaptcha
		const [canAddNew, _] = await Promise.all([
			checkExistingMessages(ip), hCaptchaPromise(body['h-captcha-response'])
		]);
		if (!canAddNew) throw new ForbiddenError(`You're not allowed to do that.`);

		const { name, message } = body;
		await addNewMessage({ ip, name, message });

		return res.status(201).json({});
	} catch (e: any) {
		if (e.status === 429) res.setHeader('Retry-After', 5);
		return res.status(e.status || 500)
			.json({ message: e.message || 'Unknown Error' });
	}
}
