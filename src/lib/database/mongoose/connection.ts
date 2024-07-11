import { connect } from 'mongoose';

declare global {
	var mongoose: {
		conn: null | typeof import('mongoose');
		promise: null | Promise<typeof import('mongoose')>;
	};
}

// Init a variable from an existing global variable
let cached = global.mongoose;

// If that global doesn't actually exist, create a base object
// with null properties to be added later
if (!cached) {
	cached = global.mongoose = { conn: null, promise: null };
}

const mongoosePromise = async () => {
	if (cached.conn !== null) {
		return cached.conn;
	}

	if (!process.env.MONGODB_URI) throw new Error('Missing MONGODB_URI');

	if (cached.promise === null) {
		cached.promise = connect(process.env.MONGODB_URI!, {
			dbName: process.env.MONGODB_DB_NAME!,
			bufferCommands: false,
		}).then((mongoose) => {
			return mongoose;
		});
	}

	try {
		cached.conn = await cached.promise;
	} catch (e) {
		cached.promise = null;
	}
	return cached.conn;
};

export default mongoosePromise;
