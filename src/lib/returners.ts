export const MalformedResponse = () =>
	Response.json({ message: 'Check your information' }, { status: 400 });

export const UnAuthorizedResponse = () =>
	Response.json({ message: 'Please sign in again' }, { status: 401 });

export const ForbiddenResponse = (message?: string) =>
	Response.json(
		{ message: message ?? `You're not allowed to do that` },
		{ status: 403 }
	);

export const NotFoundResponse = (message?: string) =>
	Response.json({ message: message ?? 'Not found' }, { status: 404 });

export const UnprocessibleResponse = () =>
	Response.json({ message: 'Check your information' }, { status: 422 });

export const RateLimitResponse = (retryTime: number) =>
	Response.json(
		{ message: 'Busy. Try again in a few minutes' },
		{
			status: 429,
			headers: { 'Retry-After': Math.floor(retryTime).toString() },
		}
	);

export const FetchErrorResponse = (message: string) =>
	Response.json({ message }, { status: 502 });

export const ServerErrorResponse = (message?: string) =>
	Response.json({ message: message ?? 'Server error' }, { status: 500 });

export const TimeoutResponse = () =>
	Response.json({ message: 'Server timed out' }, { status: 504 });

export const CustomResponse = ({
	status,
	message,
	headers,
}: {
	status: number;
	message: string;
	headers?: Record<string, string>;
}) =>
	headers
		? Response.json({ message }, { status, headers })
		: Response.json({ message }, { status });

export const BasicSuccessResponse = (message?: string) =>
	Response.json({ message: message ?? 'Success' }, { status: 200 });

export const CreatedResponse = (message?: string) =>
	Response.json({ message: message ?? 'Created' }, { status: 201 });
