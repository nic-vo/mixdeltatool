import { pageQueryParser } from '@lib/spotify/validators';
import { getServerSession } from 'next-auth';
import { routeKeyRetriever } from '@lib/auth/accessKey'
import { userPlaylistGetter } from '@lib/spotify/getterPromises';

import { authOptions } from '@lib/auth/options';
import { SPOT_LOGIN_WINDOW } from '@consts/spotify';
import {
	AuthError,
	FetchError,
	MalformedError,
	ReqMethodError
} from '@lib/spotify/errors';

import { getUserPlaylistsApiRequest } from '@components/spotify/types';
import { NextApiResponse } from 'next';

// The assumption for this route is that every sign-on refreshes access token
// Session never updates, and only exists until access token expiry

export default async function handler(
	req: getUserPlaylistsApiRequest,
	res: NextApiResponse
) {
	const globalTimeoutMS = Date.now() + 9000;
	const globalTimeout = setTimeout(() => {
		return res.status(504).json({ message: 'Server timed out' });
	}, 9000);

	const authTimeout = setTimeout(() => {
		clearTimeout(globalTimeout);
		return res.status(504).json({ message: 'Server timed out' });
	}, 4000);

	try {
		// Validate req method
		if (req.method !== 'GET') throw new ReqMethodError('GET');

		// Initialize page var and validate query parameters
		let page;
		try {
			page = pageQueryParser.parse(req.query).page;
		} catch {
			throw new MalformedError();
		}

		// Check next-auth session
		// If no session, send 401 and client-side should redirect
		const session = await getServerSession(req, res, authOptions);
		if (session === null || session === undefined) throw new AuthError();

		// Access token should never expire if there is a session
		// Custom access token retriever outside of next-auth flow
		// Network failure is possible here
		let token;
		try {
			token = await routeKeyRetriever(session.user.id);
		} catch {
			throw new FetchError('Server error; try again');
		}
		// No token means that user account somehow unlinked => client redirect
		if (token === null || token === undefined) throw new AuthError();
		// Auth cleared within 4 seconds, add remaining time to new timeout
		clearTimeout(authTimeout);

		// Check if session is being accessed when access token might not be live
		const { expiresAt, accessToken } = token;
		if (expiresAt === undefined
			|| accessToken === undefined
			|| (Date.now() - expiresAt) < (3600 - SPOT_LOGIN_WINDOW))
			throw new AuthError();

		// Hit spotify API with retrieved access token and page from query
		const data = await userPlaylistGetter({
			page, accessToken, globalTimeoutMS
		});
		clearTimeout(globalTimeout);
		return res.status(200).json(data);
	} catch (e: any) {
		clearTimeout(authTimeout);
		clearTimeout(globalTimeout);
		return res.status(e.status || 500)
			.json({ error: e.message || 'Unknown error' });
	}
}
