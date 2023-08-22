import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@lib/auth/options';
import mongoosePromise, { Account } from '@lib/database/mongoose';

// The assumption for this route is that every sign-on refreshes access token
// Session never updates, and only exists until access token expiry

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const session = await getServerSession(req, res, authOptions);
	// If no session, send 403 and redirect client-side
	if (!session) return res.status(403).json({ message: 'Unauthorized' });

	// Access token should never expire if there is a session
	let token = null;
	try {
		// Share mongoose connection init with next-auth MongoDB adapter init
		await mongoosePromise();
		token = await Account.findOne({ userId: session.user.id })
			.where('provider')
			.equals('spotify')
			.select('access_token')
			.exec();
	} catch {
		// The only errors should be at network level hopefully;
		// Assumes AccountModel is correct + next-auth adapter's don't change
		// their schema suddenly
		return res.status(501);
	};
	// No token means that token somehow expired => client-side redirect
	if (token === null) return res.status(403).json({ message: 'Unauthorized' });


	return res.status(200).json({
		message: 'Goood',
		time: Date.now(),
		token: token.access_token
	});
};
