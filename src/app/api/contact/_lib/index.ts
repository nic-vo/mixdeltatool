import mongoosePromise from '@/lib/database/mongoose/connection';
import { ContactMessage } from '@/lib/database/mongoose/models';
import { threeRetries } from '@/lib/route_helpers/wrappers';
import { z } from 'zod';

export const contactBodyParser = z
	.object({
		name: z.string().min(3).max(150),
		message: z
			.string()
			.min(3)
			.max(280 * 5),
		'g-recaptcha-response': z.string().min(1),
		'h-captcha-response': z.string().min(1),
	})
	.strict();

// Returns null or causes an instant throw in the parent
export const hCaptchaPromise = async (token: string) => {
	if (!process.env.HCAPTCHA_SECRET || !process.env.NEXT_PUBLIC_HCAPTCHA_SITEKEY)
		throw new Error();

	const params = new URLSearchParams();
	params.append('secret', process.env.HCAPTCHA_SECRET);
	params.append('response', token);
	params.append('sitekey', process.env.NEXT_PUBLIC_HCAPTCHA_SITEKEY);
	const response = await threeRetries(() =>
		fetch('https://api.hcaptcha.com/siteverify', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: params,
		})
	);
	if (!response.ok) throw new Error();
	const { success } = await response.json();
	if (!success) throw new Error();
	return;
};

// Rate limit contact form by having a hard limit on how many messages from a certain ip
export async function checkExistingMessages(checkIP: string) {
	await mongoosePromise();
	let existing = await ContactMessage.find({ ip: checkIP }).exec();
	return existing && existing.length < 5;
}

// Adds a new message if the ^ passes in parent
export const addNewMessage = async (params: {
	ip: string;
	name: string;
	message: string;
}): Promise<void> => {
	const { ip, name, message } = params;
	await mongoosePromise();
	await ContactMessage.create({ ip, name, message });
	return;
};
