import {
	User,
	Account,
	Session
} from './models';
import {
	getGlobalStatusProps,
	setNewGlobalStatus,
	CORSGet
} from './globalStatus';
import mongoosePromise from './connection';

export default mongoosePromise;

export {
	User,
	Account,
	Session,
	getGlobalStatusProps,
	setNewGlobalStatus,
	CORSGet
};
