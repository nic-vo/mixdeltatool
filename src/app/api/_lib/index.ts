import { NextRequest, NextResponse } from 'next/server';

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

export const OPTIONS = (req: NextRequest) => {
	return new NextResponse('', {
		headers: CORSHeaders(req),
		status: 200,
	});
};
