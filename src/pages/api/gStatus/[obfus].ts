import mongoosePromise, {
	GlobalStatusPointer,
	GlobalStatus
} from '@lib/database/mongoose';
import { CustomError, FetchError } from '@lib/errors';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const { obfus } = req.query;
	if (req.method === 'OPTIONS')
		return res.status(200).end();
	if (req.method !== 'POST')
		return res.status(404).json({ message: 'Wrong method' });
	if (obfus !== process.env.NEXT_PUBLIC_GLOBAL_STATUS_UPDATE_ROUTE)
		return res.status(404).json({ message: 'Not found' });

	const { status, statusType, token } = JSON.parse(req.body);
	if (!token || token !== process.env.NEXT_PUBLIC_GLOBAL_STATUS_UPDATE_SECRET)
		return res.status(404).json({ message: 'Not found' });
	if (!status || !statusType)
		return res.status(400).json({ message: 'Status needed' });

	try {
		try {
			await mongoosePromise();
		} catch {
			throw new FetchError('There was an error connecting to MongoDB');
		}
		const newStatus = new GlobalStatus({
			status, statusType, active: Date.now()
		});
		try {
			await newStatus.save();
			let currentPointer = await GlobalStatusPointer.findOneAndUpdate(
				{},
				{ current: newStatus._id }).exec();
			if (currentPointer === null) {
				currentPointer = new GlobalStatusPointer({ current: newStatus._id });
				await currentPointer.save();
			}
		} catch {
			throw new FetchError('There was an error creating a new status');
		}

		try {
			await Promise.all([res.revalidate('/'), res.revalidate('/spotify')]);
		} catch {
			throw new CustomError(500, 'There was an error pushing status to the page');
		}
	} catch (e: any) {
		return res.status(e.status || 500)
			.json({ message: e.message || 'Unknown error' });
	}
	res.status(200).json({ message: 'Status updated' });
	return;
}
