import { MongoClient } from 'mongodb';

if (!process.env.MONGODB_URI) {
	throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;
const options = {};

let SharedClient: MongoClient;

if (process.env.NODE_ENV === 'development') {
	if (global._mongoClient === undefined) {
		global._mongoClient = new MongoClient(uri, options);
	}
	SharedClient = global._mongoClient;
} else {
	SharedClient = new MongoClient(uri, options);
}

export default SharedClient;
