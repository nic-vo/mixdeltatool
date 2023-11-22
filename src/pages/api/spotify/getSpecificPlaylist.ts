import { getServerSession } from 'next-auth';
import { routeKeyRetriever } from '@lib/auth/accessKey';
import { specificQueryParser } from '@lib/spotify/validators';
import { specificPlaylistGetter } from '@lib/spotify/getterPromises';

import { authOptions } from '@lib/auth/options';
import { SPOT_LOGIN_WINDOW } from '@consts/spotify';

import { getSpecificPlaylistApiRequest } from '@components/spotify/types';
import {
	AuthError,
	FetchError,
	MalformedError,
	ReqMethodError
} from '@lib/spotify/errors';
import { NextApiResponse } from 'next';

// The assumption for this route is that every sign-on refreshes access token
// Session never updates, and only exists until access token expiry

export default async function handler(
	req: getSpecificPlaylistApiRequest, res: NextApiResponse
) {
	const globalTimeoutMS = Date.now() + 9000;
	const globalTimeout = setTimeout(() => {
		return res.status(504).json({ message: 'Server timed out' });
	}, 9000);

	const authTimeout = setTimeout(() => {
		return res.status(504).json({ message: 'Server timed out' });
	}, 3000);


	try {
		// Validate req method
		if (req.method !== 'GET') throw new ReqMethodError('GET');

		// Validate query parameters
		let id, type;
		try {
			let parsed = specificQueryParser.parse(req.query);
			id = parsed.id;
			type = parsed.type;
		} catch {
			throw new MalformedError();
		}

		// Check next-auth session
		let session;
		try {
			session = await getServerSession(req, res, authOptions);
		} catch {
			throw new FetchError('Server error; try again');
		}
		// If no session, send 401 and client-side should redirect
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
		clearTimeout(authTimeout);

		// Check if session is being accessed when access token might not be live
		const { expiresAt, accessToken } = token;
		if (expiresAt === undefined
			|| expiresAt === null
			|| accessToken === undefined
			|| accessToken === null
			|| (Date.now() - expiresAt) < (3600 - SPOT_LOGIN_WINDOW))
			throw new AuthError();

		// Hit spotify API with retrieved access token
		const data = await specificPlaylistGetter(
			{
				type,
				id,
				accessToken,
				globalTimeoutMS
			}
		);
		clearTimeout(globalTimeout);
		return res.status(200).json(data);
	} catch (e: any) {
		clearTimeout(authTimeout);
		clearTimeout(globalTimeout);
		return res.status(e.status ? e.status : 500)
			.json({ message: e.message ? e.message : 'Unknown error' });
	}
}
