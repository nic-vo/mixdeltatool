import { SPOT_LOGIN_WINDOW } from '@consts/spotify';
import { routeKeyRetriever } from '@lib/auth/accessKey';
import { authOptions } from '@lib/auth/options';
import { getServerSession } from 'next-auth';

import { NextApiResponse } from 'next';
import { createDiffPlaylistApiRequest } from '@components/spotify/types';

export default async function handler(req: createDiffPlaylistApiRequest, res: NextApiResponse) {
	try {
		// Validate req method
		if (req.method !== 'POST')
			throw { status: 405, error: 'POST only' };
		// Validate query parameters
		if (Object.keys(req.query).length !== 2
			|| 'target' in req.query === false
			|| 'discrim' in req.query === false)
			throw { status: 400, error: 'Bad request' };
		// Spotify playlist id *SHOULD* be 22 chars, alphanumeric
		if (/^[A-Za-z0-9]{22}$/.test(req.query.target) === false
			|| /^[A-Za-z0-9]{22}$/.test(req.query.discrim) === false)
			throw { status: 422, error: 'Bad request' };

		// Check next-auth session
		const session = await getServerSession(req, res, authOptions);
		// If no session, send 401 and client-side should redirect
		if (session === null || session === undefined)
			throw { status: 401, error: 'Unauthorized' };

		// Access token should never expire if there is a session
		let token = null;
		// Custom access token retriever outside of next-auth flow
		// Network failure is possible here
		try {
			token = await routeKeyRetriever(session.user.id);
		} catch {
			throw { status: 502, error: 'Network error' };
		};
		// No token means that user account somehow unlinked => client redirect
		if (token === null) throw { status: 401, error: 'Unauthorized' };

		// Check if session is being accessed when access token might not be live
		const { expires_at, access_token } = token;
		if (expires_at === undefined
			|| Date.now() - expires_at < 3600 - SPOT_LOGIN_WINDOW)
			throw { status: 401, error: 'Unauthorized' };
	} catch (e: any) {
		return res.status(e.status || 500)
			.json({ error: e.error || 'Unknown error' });
	};

	return res.status(200).json({ message: 'Success' });
};
