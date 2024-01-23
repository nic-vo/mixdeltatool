import { SPOT_URL_BASE } from '@consts/spotify';
import {
	AuthError,
	FetchError,
	ForbiddenError,
	RateError,
	TimeoutError
} from '../errors';
import { spotUserObjectParser } from './validators';

export async function localTimeout<D>(
	globalTimeoutMS: number,
	localLimit: number
): Promise<D> {
	return new Promise(async (_, rej) => {
		await new Promise(async r => setTimeout(() => r, Date.now() - globalTimeoutMS - localLimit));
		return rej(new TimeoutError());
	})
};

export async function userGetter(args: {
	accessToken: string,
	globalTimeoutMS: number
}): Promise<string> {
	const { accessToken, globalTimeoutMS } = args;
	const localLimit = 2200;
	const localTimeoutMS = globalTimeoutMS - localLimit;
	const url = SPOT_URL_BASE.concat('me');
	const headers = new Headers();
	headers.append('Authorization', `Bearer ${accessToken}`);

	return Promise.race([
		localTimeout<string>(globalTimeoutMS, localLimit),
		new Promise<string>(async (res, rej) => {
			try {
				let response;
				let networkRetry = true;
				while (true) {
					try {
						response = await fetch(url, { headers });
					} catch {
						if (networkRetry === false)
							throw new FetchError('There was an error reaching Spotify');
						networkRetry = false;
						continue;
					}
					networkRetry = true;
					if (response.status === 429) {
						const tryHeader = response.headers.get('Retry-After');
						// Retry based on Retry-After header in sec, otherwise 2s wait
						const retry = tryHeader !== null ? parseInt(tryHeader) * 1000 : 2000;
						// Throw rate error if wait would pass the timeout time
						if ((Date.now() + retry) >= localTimeoutMS) throw new RateError(10);
						// Await retry if within timeout time
						await new Promise(async r => setTimeout(r, retry));
						// Continue for while loop
						continue;
					}
					break;
				}
				if (!response)
					throw new FetchError('There was an error reaching Spotify');
				if (response.ok === false) {
					// This is if somehow after all this, Spotify detects something wrong
					switch (response.status) {
						case 401:
							throw new AuthError();
						case 403:
							throw new ForbiddenError(`We can't find you`);
						default:
							throw new FetchError('There was an error reaching Spotify');
					}
				}

				let id;
				try {
					const jsoned = await response.json();
					const parsed = spotUserObjectParser.parse(jsoned);
					id = parsed.id;
				} catch {
					throw new FetchError("There was an error with Spotify's response");
				}
				return res(id as string);
			} catch (e: any) {
				return rej(e);
			}
		})]);
}
