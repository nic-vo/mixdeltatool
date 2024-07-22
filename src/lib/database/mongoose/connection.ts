import mongoose from 'mongoose';

declare global {
	var mongooseConn: {
		conn: null | mongoose.Mongoose;
		promise: null | Promise<mongoose.Mongoose>;
	};
}

// Init a variable from an existing global variable
let cached = global.mongooseConn;

// If that global doesn't actually exist, create a base object
// with null properties to be added later
if (!cached) {
	cached = global.mongooseConn = { conn: null, promise: null };
}

const mongoosePromise = async () => {
	if (!process.env.MONGODB_URI || !process.env.MONGODB_DB_NAME)
		throw new Error('Missing MONGODB details');
	if (process.env.NODE_ENV === 'development') {
		if (cached.conn) return cached.conn;

		if (cached.promise === null) {
			cached.promise = mongoose.connect(process.env.MONGODB_URI, {
				dbName: process.env.MONGODB_DB_NAME,
				bufferCommands: false,
			});
		}
		try {
			cached.conn = await cached.promise;
		} catch (e) {
			cached.promise = null;
			throw e;
		}
		return cached.conn;
	} else {
		return mongoose.connect(process.env.MONGODB_URI, {
			dbName: process.env.MONGODB_DB_NAME,
			bufferCommands: false,
		});
	}
};

export default mongoosePromise;
