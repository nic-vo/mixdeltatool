import { SPOT_URL_BASE } from '@consts/spotify';
import { spotUserObjectParser } from './validators';

import {
	AuthError,
	FetchError,
	ForbiddenError,
	MalformedError,
	NotFoundError,
	RateError,
	TimeoutError
} from '../errors';

export async function localTimeout<D>(
	parentTimeout: number,
): Promise<D> {
	await new Promise(async r => setTimeout(() => r, parentTimeout - Date.now()));
	throw new TimeoutError();
	// /*
	// 	In parent, calculate the value by subtracting how much time to leave for
	// 	Rest of execution from globalTimeoutMS
	// */
	// return new Promise(async (_, rej) => {
	// 	await new Promise(async r => setTimeout(() => r, parentTimeout - Date.now()));
	// 	return rej(new TimeoutError());
	// })
};

export async function userGetter(args: {
	accessToken: string,
	globalTimeoutMS: number
}): Promise<string> {
	const { accessToken, globalTimeoutMS } = args;
	const parentTimeoutMS = globalTimeoutMS - 5000;
	const url = SPOT_URL_BASE.concat('me');
	const headers = new Headers();
	headers.append('Authorization', `Bearer ${accessToken}`);

	return Promise.race([
		localTimeout<string>(parentTimeoutMS),
		(async (): Promise<string> => {
			const request = fetch(url, { headers });
			const response = await getOnePromise({
				request,
				silentFail: false,
				parentTimeoutMS
			})
			let id: string;
			try {
				const jsoned = await response.json();
				const parsed = spotUserObjectParser.parse(jsoned);
				id = parsed.id;
			} catch {
				throw new FetchError("There was an error with Spotify's response");
			}
			return id;
		})()]);
}

export async function getOnePromise(params:
	{
		request: Promise<Response>,
		parentTimeoutMS: number,
		silentFail: boolean,
		errorOverrides?: { status: number, message: string }[]
	}
): Promise<Response> {
	const { request, parentTimeoutMS, silentFail, errorOverrides } = params;
	let response: Response;
	let networkRetry = true;
	while (true) {
		try {
			response = await request;
		} catch {
			if (networkRetry === false)
				throw new FetchError();
			networkRetry = false;
			continue;
		}
		networkRetry = true;
		if (response.status === 429) {
			const tryHeader = response.headers.get('Retry-After');
			// Retry based on Retry-After header in sec, otherwise 2s wait
			const retry = tryHeader !== null ? parseInt(tryHeader) * 1000 : 2000;
			// Throw rate error if wait would pass the timeout time
			if ((Date.now() + retry) >= parentTimeoutMS)
				throw new RateError(retry / 1000);
			// Await retry if within timeout time
			await new Promise(async r => setTimeout(r, retry));
			// Continue for while loop
			continue;
		}
		break;
	}
	if (response.ok || silentFail) return response;
	// If !ok and silentFail, the whole fetch doesn't matter
	if (errorOverrides)
		for (const custom of errorOverrides)
			if (response.status === custom.status)
				throw custom;
	switch (response.status) {
		case 400: throw new MalformedError();
		case 401: throw new AuthError();
		case 403: throw new ForbiddenError();
		case 404: throw new NotFoundError();
		default: throw new FetchError("There's something wrong with Spotify");
	}
};
