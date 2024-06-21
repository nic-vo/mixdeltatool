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
};

const badResponse = (
	status: keyof typeof defaultErrorMessages,
	details?: {
		message?: string;
		headers?: Record<string, string>;
	}
) => {
	if (!details) {
		const message = defaultErrorMessages[status];
		return Response.json({ message }, { status });
	}
	const { message, headers } = details;
	return Response.json(
		{ message: message ?? defaultErrorMessages[status] },
		{ status, headers }
	);
};

export default badResponse;
