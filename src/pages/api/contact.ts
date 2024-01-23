import {
	addNewMessage,
	checkExistingMessages,
	hCaptchaPromise
} from '@lib/contact/helpers';
import { contactBodyParser } from '@lib/contact/validators';

import { CustomError, ForbiddenError, MalformedError } from '@lib/errors';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	try {
		const ip = req.headers['x-forwarded-for'] as string;
		if (!ip) throw new CustomError(500, 'Internal error');

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
