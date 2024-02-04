import type { Model } from 'mongoose';
import type { Mongoose } from 'mongoose';

declare global {
	var UserModelPersist: Model;
	var SessionModelPersist: Model;
	var AccountModelPersist: Model;

	var mongoose;
}

export { };
