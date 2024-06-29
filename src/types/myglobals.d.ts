import '@hcaptcha/types';

declare global {
	var _mongoClientPromise: Promise<MongoClient>;
}

export {};
