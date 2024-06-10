import { randomBytes } from 'crypto';
import { NextRequest } from 'next/server';
import { TimeoutResponse } from '../returners';
import { AppRouteHandlerFnContext } from 'next-auth/lib/types';
import { NextAuthRequest } from 'next-auth/lib';
import { auth } from '@/auth';

export function printTime(message: string, start: number) {
	const now = Date.now();
	console.log(message, now - start, 'ms');
	return now;
}

export function genUId(length: number) {
	const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
	const buffer = randomBytes(length * 2);
	let result = '';
	for (let i = 0; i < length; i++) {
		result += chars.charAt(buffer.readUInt8(i) % chars.length);
	}
	return result;
}

type BaseHandler = (
	req: NextRequest,
	ctx: AppRouteHandlerFnContext
) => Promise<Response>;

type HandlerAcceptingAuth = (
	req: NextAuthRequest,
	ctx: AppRouteHandlerFnContext
) => Promise<Response>;

export async function handlerWithTimeout(
	timeoutS: number,
	handler: BaseHandler
) {
	return async (req: NextRequest, ctx: AppRouteHandlerFnContext) =>
		await Promise.race([
			handler(req, ctx),
			new Promise((res) =>
				setTimeout(
					() => res(TimeoutResponse()),
					Math.floor(timeoutS - 2) * 1000
				)
			),
		]);
}

export async function handlerWithTimeoutAndAuth(
	timeoutS: number,
	handler: HandlerAcceptingAuth
) {
	return async (req: NextAuthRequest, ctx: AppRouteHandlerFnContext) =>
		await Promise.race([
			auth(handler)(req, ctx),
			new Promise<Response>((res) =>
				setTimeout(() => res(TimeoutResponse()), (timeoutS - 1) * 1000)
			),
		]);
}
