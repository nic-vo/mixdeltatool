import mongoosePromise from '@/lib/database/mongoose';
import { ContactMessage } from '@/lib/database/mongoose/models';

import { CustomError, FetchError, MalformedError } from '@/lib/errors';

// Returns null or causes an instant throw in the parent
export const hCaptchaPromise = async (token: string): Promise<null> => {
	const params = new URLSearchParams();
	params.append('secret', process.env.HCAPTCHA_SECRET!);
	params.append('response', token);
	params.append('sitekey', process.env.NEXT_PUBLIC_HCAPTCHA_SITEKEY!);
	return new Promise(async (res, rej) => {
		let retries = 0;
		let response;
		while (retries < 3) {
			try {
				response = await fetch('https://api.hcaptcha.com/siteverify', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded',
					},
					body: params,
				});
			} catch {
				if (retries < 3) {
					retries++;
					continue;
				}
				return rej(new FetchError('There was an error with our servers.'));
			}
			break;
		}
		if (response === undefined)
			return rej(new CustomError(500, 'Internal error.'));
		const jsoned = await response.json();
		if (!jsoned.success) return rej(new MalformedError());
		return res(null);
	});
};

// Rate limit contact form by having a hard limit on how many messages from a certain ip
export async function checkExistingMessages(checkIP: string) {
	await mongoosePromise();
	let existing = await ContactMessage.find({ ip: checkIP }).exec();
	return existing !== undefined && existing !== null && existing.length < 5;
}

// Adds a new message if the ^ passes in parent
export const addNewMessage = async (params: {
	ip: string;
	name: string;
	message: string;
}): Promise<null> => {
	const { ip, name, message } = params;

	return new Promise(async (res, rej) => {
		try {
			await mongoosePromise();
		} catch {
			return rej(new CustomError(500, 'Internal error'));
		}
		let existing;
		try {
			existing = await ContactMessage.create({ ip, name, message });
		} catch {
			return rej(new CustomError(500, 'Internal error'));
		}
		return res(null);
	});
};
