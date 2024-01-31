class MalformedError extends Error {
	status: number;
	message: string;

	constructor() {
		super();
		this.status = 400;
		this.message = 'Check your information';
	}
}

class AuthError extends Error {
	status: number;
	message: string;

	constructor() {
		super();
		this.status = 401;
		this.message = 'Please sign in again';
	}
}

class ForbiddenError extends Error {
	status: number;
	message: string;

	constructor(message?: string) {
		super();
		this.status = 403;
		this.message = message? message: "You're not allowed to do that.";
	}
}

class NotFoundError extends Error {
	status: number;
	message: string;

	constructor(message?: string) {
		super();
		this.status = 404;
		this.message = message? message: "Couldn't find that.";
	}
}

class ReqMethodError extends Error {
	status: number;
	message: string;

	constructor(reqType: string) {
		super();
		this.status = 405;
		this.message = `${reqType} only`;
	}
}

class UnprocessableError extends Error {
	status: number;
	message: string;

	constructor() {
		super();
		this.status = 422;
		this.message = 'Check your information';
	}
}

class RateError extends Error {
	status: number;
	message: string;
	retryTime: number

	constructor(retryTime: number) {
		super();
		this.status = 429;
		this.message = `Busy. Try again in a few minutes`;
		this.retryTime = retryTime;
	}
}

class FetchError extends Error {
	status: number;
	message: string;

	constructor(message?: string) {
		super();
		this.status = 502;
		this.message = message ? message : 'There was an error reaching spotify';
	}
}

class TimeoutError extends Error {
	status: number;
	message: string;

	constructor() {
		super();
		this.status = 504;
		this.message = 'Server timed out';
	}
}

class CustomError extends Error {
	status: number;
	message: string;

	constructor(status: number, message: string) {
		super();
		this.status = status;
		this.message = message;
	}
}

export {
	MalformedError,
	AuthError,
	ForbiddenError,
	NotFoundError,
	ReqMethodError,
	UnprocessableError,
	RateError,
	FetchError,
	TimeoutError,
	CustomError,
}
