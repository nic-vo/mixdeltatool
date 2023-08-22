import { User, Account, Session } from './models';
import mongoosePromise from './connection';

export default mongoosePromise;

export { User, Account, Session };
