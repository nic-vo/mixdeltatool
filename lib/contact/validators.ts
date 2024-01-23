import { z } from 'zod';

export const contactBodyParser = z.object({
	name: z.string().min(3).max(150),
	message: z.string().min(3).max(280 * 5),
	'g-recaptcha-response': z.string(),
	'h-captcha-response': z.string()
}).strict();
