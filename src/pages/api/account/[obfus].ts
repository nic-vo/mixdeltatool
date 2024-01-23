import { getServerSession } from 'next-auth';

import { authOptions } from '@lib/auth/options';
import { AuthError } from '@lib/errors';

import { NextApiRequest, NextApiResponse } from 'next';
import { sessionDeleter, userDeleter } from '@lib/auth/accountDeletion';
import { AUTH_WINDOW, GLOBAL_EXECUTION_WINDOW } from '@consts/spotify';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const { obfus } = req.query;
	if (obfus !== process.env.NEXT_PUBLIC_ACCOUNT_ROUTE_OBFUS)
		return res.status(404).json({ message: 'Not found' })
	if (req.method !== 'GET')
		return res.status(405).json({ message: 'GET only' });

	const globalTimeoutMs = Date.now() + GLOBAL_EXECUTION_WINDOW;
	const globalTimeout = setTimeout(() => {
		return res.status(504).json({ message: 'Server timed out' });
	}, GLOBAL_EXECUTION_WINDOW);
	const authTimeout = setTimeout(() => {
		clearTimeout(globalTimeout);
		return res.status(504).json({ message: 'Server timed out' });
	}, AUTH_WINDOW);

	let session;
	try {
		session = await getServerSession(req, res, authOptions);
		clearTimeout(authTimeout);
		if (session === null || session === undefined) throw new AuthError();
		await userDeleter(session.user.id);
		clearTimeout(globalTimeout)
		res.status(200).json({ message: 'Success' });
		// Hopefully this returns status to user but continues execution of handler
	} catch (e: any) {
		clearTimeout(authTimeout);
		clearTimeout(globalTimeout);
		return res.status(e.status ? e.status : 500)
			.json({ message: e.message ? e.message : 'Unknown error' });
	}

	// Handle session deletion after user and account deletion;
	const postTimeout = setTimeout(() => {
		console.log(`Timeout deleting sessions for ${session!.user.id}`);
		return null;
	}, globalTimeoutMs - Date.now());

	try {
		await sessionDeleter(session.user.id);
	} catch (e: any) {
		const message = e.message ? e.message
			: `Error deleting sessions for ${session.user.id}`;
		console.log(message);
	}
	clearTimeout(postTimeout);
	return null;
}
