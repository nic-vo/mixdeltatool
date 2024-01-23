import { connect } from 'mongoose';

if (!process.env.MONGODB_URI) {
	throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
};

// Init a variable from an existing global variable
let cached = global.mongoose;

// If that global doesn't actually exist, create a base object
// with null properties to be added later
if (!cached) {
	cached = global.mongoose = { conn: null, promise: null };
}

async function mongoosePromise() {
	if (cached.conn !== null) {
		return cached.conn;
	}

	if (cached.promise === null) {
		const opts = {
			bufferCommands: false
		};

		cached.promise = connect(process.env.MONGODB_URI!, {
			dbName: process.env.MONGODB_DB_NAME!,
			...opts
		}).then((mongoose) => { return mongoose });
	};

	try {
		cached.conn = await cached.promise;
	} catch (e) {
		cached.promise = null
	};
	return cached.conn;
}

export default mongoosePromise;
