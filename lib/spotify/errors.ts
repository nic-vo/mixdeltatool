class MalformedError extends Error {
	status: number;
	message: string;

	constructor() {
		super();
		this.status = 400;
		this.message = 'Check your information';
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

class AuthError extends Error {
	status: number;
	message: string;

	constructor() {
		super();
		this.status = 401;
		this.message = 'Please sign in again';
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

class RateError extends Error {
	status: number;
	message: string;

	constructor() {
		super();
		this.status = 429;
		this.message = 'Please try again in a few minutes';
	}
}

class FetchError extends Error {
	status: number;
	message: string;

	constructor(message: string) {
		super();
		this.status = 502;
		this.message = message;
	}
}

class ForbiddenError extends Error {
	status: number;
	message: string;

	constructor(message: string) {
		super();
		this.status = 403;
		this.message = message;
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
	RateError,
	ReqMethodError,
	CustomError,
	ForbiddenError,
	FetchError,
	TimeoutError,
	UnprocessableError
}
