import mongoosePromise, { Session } from '@/lib/database/mongoose';
import { checkAndUpdateEntry } from '@/lib/database/redis/ratelimiting';
import { CustomError, NotFoundError, RateError } from '@/lib/errors';

import { NextRequest, NextResponse } from 'next/server';

const RATE_LIMIT_PREFIX = 'DOS';
const RATE_LIMIT_ROLLING_LIMIT = 3;
const RATE_LIMIT_DECAY_SECONDS = 60;

const CORSGet = (req: NextRequest) => {
	const origin = req.headers.get('Origin');
	if (process.env.NODE_ENV === 'development' && origin) {
		return origin;
	}
	if (origin !== process.env.SAFE_ORIGIN)
		return 'https://mixdeltatool.vercel.app';
	return origin;
};

const CORSHeaders = (req: NextRequest) => {
	return {
		'Access-Control-Allow-Credentials': 'true',
		'Access-Control-Allow-Origin': CORSGet(req),
		'Access-Control-Allow-Methods': 'OPTIONS,POST',
		'Access-Control-Allow-Headers':
			'Accept, Accept-Version, Content-Length, Content-Type, Date, Accept-Encoding',
	};
};

export function OPTIONS(req: NextRequest) {
	return new NextResponse('', {
		headers: CORSHeaders(req),
		status: 200,
	});
}

export async function POST(req: NextRequest) {
	try {
		if (
			process.env.GLOBAL_SAFETY === 'ON' ||
			req.nextUrl.pathname.split('/').pop() !==
				process.env.SESSION_CRON_ROUTE ||
			req.headers.get('Authorization') !== process.env.SESSION_CRON_SECRET
		)
			throw new NotFoundError('Not found');

		const { ip } = req;
		if (!ip) throw new CustomError(500, 'Internal Error');
		const rateLimit = await checkAndUpdateEntry({
			ip,
			prefix: RATE_LIMIT_PREFIX,
			rollingLimit: RATE_LIMIT_ROLLING_LIMIT,
			rollingDecaySeconds: RATE_LIMIT_DECAY_SECONDS,
		});
		if (rateLimit !== null) throw new RateError(rateLimit);

		try {
			await mongoosePromise();
			const now = new Date(Date.now() - 1000 * 60 * 60);
			Session.deleteMany({
				expires: { $lt: now },
			}).exec();
			// const deleted = await Session.deleteMany({
			// 	expires: { $lt: now },
			// }).exec();
			// console.log(deleted);
		} catch {}
	} catch (e: any) {
		return NextResponse.json(
			{ message: e.message ?? 'Unknown server error' },
			{ status: e.status ?? 500 }
		);
	}
	return NextResponse.json({ message: 'Initiated' }, { status: 200 });
}
