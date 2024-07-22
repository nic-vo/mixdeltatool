import { MongoClient } from 'mongodb';

declare global {
	var _mongoClient: MongoClient | undefined;
	var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (!process.env.MONGODB_URI) {
	throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;
const options = {};

const MongoClientConnection = async () => {
	if (process.env.NODE_ENV === 'development') {
		if (global._mongoClient) return global._mongoClient;
		if (global._mongoClientPromise === undefined) {
			global._mongoClientPromise = new MongoClient(uri, options).connect();
		}
		try {
			global._mongoClient = await global._mongoClientPromise;
		} catch (e) {
			console.log(e);
			throw e;
		}
		return global._mongoClient;
	} else {
		return await new MongoClient(uri, options).connect();
	}
};

export default MongoClientConnection;
