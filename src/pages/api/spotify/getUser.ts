import { pageQueryParser } from '@lib/spotify/validators';
import { getServerSession } from 'next-auth';
import { routeKeyRetriever } from '@lib/auth/accessKey'
import { userPlaylistGetter } from '@lib/spotify/getterPromises';
import { checkAndUpdateEntry } from '@lib/database/redis/ratelimiting';

import { authOptions } from '@lib/auth/options';
import {
	AUTH_WINDOW,
	GLOBAL_EXECUTION_WINDOW,
	SPOT_LOGIN_WINDOW
} from '@consts/spotify';
import {
	AuthError,
	FetchError,
	MalformedError,
	ReqMethodError
} from '@lib/errors';

import { NextApiRequest, NextApiResponse } from 'next';

// The assumption for this route is that every sign-on refreshes access token
// Session never updates, and only exists until access token expiry

const RATE_LIMIT_PREFIX = 'GUP';
const RATE_LIMIT_ROLLING_LIMIT = 10;
const RATE_LIMIT_DECAY_SECONDS = 5;

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	// return res.status(404).json({message: `Testing a proper error.`});
	const globalTimeoutMS = Date.now() + GLOBAL_EXECUTION_WINDOW;
	const globalTimeout = setTimeout(() => {
		return res.status(504).json({ message: 'Server timed out' });
	}, GLOBAL_EXECUTION_WINDOW);

	// If auth doesn't resolve in window, something's wrong anyway and cancel
	const authTimeout = setTimeout(() => {
		clearTimeout(globalTimeout);
		return res.status(504).json({ message: 'Server timed out' });
	}, AUTH_WINDOW);

	try {
		if (req.method !== 'GET') throw new ReqMethodError('GET');

		/*
			***
			Hopefully this is a low-impact route that doesn't require rate-limiting;
			if it does, will uncomment
			***
		*/

		// const forHeader = req.headers['x-forwarded-for'];
		// if (!forHeader)
		// 	throw new CustomError(500, 'Internal Error');
		// const ip = Array.isArray(forHeader) ? forHeader[0] : forHeader;
		// const rateLimit = await checkAndUpdateEntry({
		// 	ip,
		// 	prefix: RATE_LIMIT_PREFIX,
		// 	rollingLimit: RATE_LIMIT_ROLLING_LIMIT,
		// 	rollingDecaySeconds: RATE_LIMIT_DECAY_SECONDS
		// });

		// if (rateLimit !== null)
		// 	throw new RateError(rateLimit);

		// Validate req method
		// Initialize page var and validate query parameters

		let page;
		try {
			page = pageQueryParser.parse(req.query).page;
		} catch {
			throw new MalformedError();
		}

		// Check next-auth session
		// If no session, send 401 and client-side should redirect
		let session;
		try {
			session = await getServerSession(req, res, authOptions);
		} catch {
			throw new FetchError('Server error; try again');
		}
		if (session === null) throw new AuthError();

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
		// Auth cleared within 4 seconds
		clearTimeout(authTimeout);

		// Check if session is being accessed when access token might not be live
		const { expiresAt, accessToken } = token;
		if (expiresAt === undefined
			|| expiresAt === null
			|| accessToken === undefined
			|| accessToken === null
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
		if (e.status === 429) res.setHeader('Retry-After', e.retryTime);
		return res.status(e.status ? e.status : 500)
			.json({ message: e.message ? e.message : 'Unknown error' });
	}
}
