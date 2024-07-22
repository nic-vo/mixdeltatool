import { badResponse, defaultErrorMessages } from './responses';
import { auth } from '@/auth';
import checkAndUpdateEntry from '../database/redis/ratelimiting';

import { AppRouteHandlerFnContext } from 'next-auth/lib/types';
import { NextRequest } from 'next/server';
import { NextAuthRequest } from 'next-auth/lib';

type BaseHandler = (
	req: NextRequest,
	ctx: AppRouteHandlerFnContext
) => Promise<Response>;

type HandlerAcceptingAuth = (
	req: NextAuthRequest,
	ctx: AppRouteHandlerFnContext
) => Promise<Response>;

type RLArg = {
	RATE_LIMIT_PREFIX: string;
	RATE_LIMIT_ROLLING_LIMIT: number;
	RATE_LIMIT_DECAY_SECONDS: number;
};

type myConfigType = { maxDuration: number; rateLimit?: RLArg };

/*
	Handlers must accept NextRequest and Next context object
	Next will pass in the standard NextRequest
	If auth is implicated,
*/
export function handlerWithTimeout(config: myConfigType, handler: BaseHandler) {
	return async (req: NextRequest, ctx: AppRouteHandlerFnContext) => {
		if (process.env.GLOBAL_SAFETY === 'ON') return badResponse(404);
		if (config.rateLimit && process.env.NODE_ENV !== 'development') {
			const {
				rateLimit: {
					RATE_LIMIT_DECAY_SECONDS,
					RATE_LIMIT_PREFIX,
					RATE_LIMIT_ROLLING_LIMIT,
				},
			} = config;
			const { ip } = req;
			console.log(ip);
			if (!ip) return badResponse(500);
			try {
				const rateLimitValue = await checkAndUpdateEntry({
					prefix: RATE_LIMIT_PREFIX,
					rollingLimit: RATE_LIMIT_ROLLING_LIMIT,
					rollingDecaySeconds: RATE_LIMIT_DECAY_SECONDS,
					ip,
				});
				if (rateLimitValue)
					return badResponse(429, {
						headers: { 'Retry-After': rateLimitValue.toString() },
					});
			} catch {
				return badResponse(502, {
					message: 'There was an error reaching the servers',
				});
			}
		}
		return await Promise.race<Response>([
			handler(req, ctx),
			new Promise((res) =>
				setTimeout(
					() => res(badResponse(504)),
					Math.floor(config.maxDuration - 1) * 1000
				)
			),
		]);
	};
}

// This function returns the function that Next.js will ultimately use for the route
// Vanilla NextRequest as input
// Calls auth, which
export function handlerWithTimeoutAndAuth(
	config: myConfigType,
	handler: HandlerAcceptingAuth
) {
	return async (req: NextRequest, ctx: AppRouteHandlerFnContext) => {
		if (process.env.GLOBAL_SAFETY === 'ON') return badResponse(404);
		if (config.rateLimit && process.env.NODE_ENV !== 'development') {
			const {
				rateLimit: {
					RATE_LIMIT_DECAY_SECONDS,
					RATE_LIMIT_PREFIX,
					RATE_LIMIT_ROLLING_LIMIT,
				},
			} = config;
			const { ip } = req;
			if (!ip) return badResponse(500);
			try {
				const rateLimitValue = await checkAndUpdateEntry({
					prefix: RATE_LIMIT_PREFIX,
					rollingLimit: RATE_LIMIT_ROLLING_LIMIT,
					rollingDecaySeconds: RATE_LIMIT_DECAY_SECONDS,
					ip,
				});
				if (rateLimitValue)
					return badResponse(429, {
						headers: { 'Retry-After': rateLimitValue.toString() },
					});
			} catch {
				return badResponse(502, {
					message: 'There was an error reaching the servers',
				});
			}
		}
		return await Promise.race([
			auth(handler)(req, ctx) as Promise<Response>,
			new Promise<Response>((res) =>
				setTimeout(() => res(badResponse(504)), (config.maxDuration - 1) * 1000)
			),
		]);
	};
}

export async function threeRetries(
	internalReq: () => Promise<Response>,
	overrides?: Partial<Record<number, string>>
) {
	// For either rate limited responses or network errors
	let retries = 3;
	let response;
	while (retries !== 0) {
		try {
			response = await internalReq();
			if (response.status === 429) {
				const retryAfter = response.headers.get('Retry-After') ?? '5';
				retries--;
				if (retries === 0)
					return badResponse(429, { headers: { 'Retry-After': retryAfter } });
				await new Promise((r) => setTimeout(r, parseInt(retryAfter) * 1000));
				continue;
			}
			break;
		} catch {
			retries--;
		}
		if (retries === 0)
			return badResponse(502, {
				message: 'There was an error connecting to Spotify',
			});
	}

	if (!response)
		return badResponse(502, {
			message: 'There was an error with the server. Try again',
		});

	if (response.ok) return response;

	if (overrides && overrides[response.status])
		return badResponse(response.status, {
			message: overrides[response.status],
		});

	return badResponse(response.status);
}
