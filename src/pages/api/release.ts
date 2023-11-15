import { getServerSession } from 'next-auth';

import { authOptions } from '@lib/auth/options';
import { AuthError } from '@lib/spotify/errors';

import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const globalTimeout = setTimeout(() => {
		return res.status(504).json({ message: 'Server timed out' });
	}, 9000);
	const authTimeout = setTimeout(() => {
		clearTimeout(globalTimeout);
		return res.status(504).json({ message: 'Server timed out' });
	}, 4000);

	try {
		const session = await getServerSession(req, res, authOptions);
		if (session === null || session === undefined) throw new AuthError();
		clearTimeout(globalTimeout);
	} catch (e: any) {
		clearTimeout(authTimeout);
		clearTimeout(globalTimeout);
		return res.status(e.status || 500)
			.json({ message: e.message || 'Unknown error' });
	}
}
