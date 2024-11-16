import { NextRequest, NextResponse } from 'next/server';

const CORSGet = (req: NextRequest) => {
	const origin = req.headers.get('Origin');
	if (process.env.NODE_ENV === 'development' && origin) {
		return origin;
	}
	if (origin !== process.env.SAFE_ORIGIN) return 'https://mixdelta.xyz';
	return origin;
};

type MyMethods = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
type nonEmptyArray<T> = [T, ...T[]];

export const createOptions = (methods: nonEmptyArray<MyMethods>) => {
	return (req: NextRequest) =>
		new NextResponse('', {
			headers: {
				'Access-Control-Allow-Credentials': 'true',
				'Access-Control-Allow-Origin': CORSGet(req),
				'Access-Control-Allow-Methods': `OPTIONS,${methods.join(',')}`,
				'Access-Control-Allow-Headers':
					'Accept, Accept-Version, Content-Length, Content-Type, Date, Accept-Encoding',
			},
			status: 200,
		});
};

export const defaultErrorMessages = {
	401: 'Please sign in again',
	400: 'Check your information',
	403: `You're not allowed to do that`,
	404: 'Not found',
	422: 'Check your information',
	429: 'Busy. Try again in a few minutes',
	500: 'Server Error',
	502: `Something happened to Spotify's response`,
	503: `Something happened to Spotify's servers`,
	504: 'Server timed out',
} as Record<number, string>;

export const badResponse = (
	status: number,
	details?: {
		message?: string;
		headers?: Record<string, string>;
	}
) => {
	if (!defaultErrorMessages[status])
		return Response.json(
			{ message: defaultErrorMessages[500] },
			{ status: 500 }
		);
	if (!details) {
		const message = defaultErrorMessages[status] ?? defaultErrorMessages[500];
		return Response.json({ message }, { status });
	}
	const { message, headers } = details;
	return Response.json(
		{ message: message ?? defaultErrorMessages[status] },
		{ status, headers }
	);
};
