import { randomBytes } from 'crypto';

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
