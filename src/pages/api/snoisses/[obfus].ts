import mongoosePromise, { Session } from '@lib/database/mongoose';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const { obfus } = req.query;
	if (obfus !== process.env.SESSION_CRON_ROUTE)
		return res.status(404).json({ message: 'Not found' });
	if (req.headers.authorization !== process.env.SESSION_CRON_SECRET)
		return res.status(404).json({ message: 'Not found' });
	res.status(200).json({ message: 'Beginning to clear' });
	try {
		await mongoosePromise();
		const now = new Date(Date.now() - (1000 * 60 * 60));
		console.log(now.getTime())
		const deleted = await Session.deleteMany(
			{ expires: { $lt: now } }
		).exec();
		console.log(deleted);
	}
	catch { }
	return;
}
