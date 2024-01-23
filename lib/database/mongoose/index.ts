import {
	User,
	Account,
	Session,
	GlobalStatusPointer,
	GlobalStatus
} from './models';
import mongoosePromise from './connection';

export default mongoosePromise;

export {
	User,
	Account,
	Session,
	GlobalStatusPointer,
	GlobalStatus
};
