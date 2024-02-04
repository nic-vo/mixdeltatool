import { setNewGlobalStatus, CORSGet } from '@lib/database/mongoose';

import { CustomError } from '@lib/errors';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const { obfus } = req.query;

	res.setHeader('Access-Control-Allow-Credentials', 'true');
	res.setHeader('Access-Control-Allow-Origin', CORSGet(req));
	res.setHeader('Access-Control-Allow-Methods', 'OPTIONS,POST');
	res.setHeader('Access-Control-Allow-Headers',
		'Accept, Accept-Version, Content-Length, Content-Type, Date, Accept-Encoding');

	if (req.method === 'OPTIONS') return res.status(200).end();
	if (req.method !== 'POST')
		return res.status(404).json({ message: 'Wrong method' });
	if (obfus !== process.env.NEXT_PUBLIC_GLOBAL_STATUS_UPDATE_ROUTE)
		return res.status(404).json({ message: 'Not found' });

	const { status, statusType, token } = req.body;
	if (!token || token !== process.env.NEXT_PUBLIC_GLOBAL_STATUS_UPDATE_SECRET)
		return res.status(404).json({ message: 'Not found' });
	if (!status || !statusType)
		return res.status(400).json({ message: 'Status needed' });

	try {
		await setNewGlobalStatus({ status, statusType });
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
