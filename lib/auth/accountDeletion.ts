import mongoosePromise, { Account, Session, User } from '@lib/database/mongoose';

export const userDeleter = async (id: string) => {
	try {
		await mongoosePromise();
		await Promise.all([
			new Promise(async (resolve, reject): Promise<void> => {
				try {
					await Account.findOneAndDelete({ userId: id })
						.where('provider')
						.equals('spotify')
						.exec();
					resolve(null);
				} catch {
					const message = 'Error deleting account';
					reject({ message });
				}
			}),
			new Promise(async (resolve, reject): Promise<void> => {
				try {
					await User.findByIdAndDelete(id);
					resolve(null);
				} catch {
					const message = 'Error deleting user';
					reject({ message });
				}
			}),
			new Promise(async (resolve, _): Promise<void> => {
				try {
					await sessionDeleter(id);
				} catch {
					// Silent catch for sessions: nbd
				}
				resolve(null)
			})
		]);
	} catch (e: any) {
		throw ({ message: e.message || 'Unknown error deleting user' });
	}
	return;
}

export const sessionDeleter = async (id: string) => {
	try {
		await mongoosePromise();
		await Session.deleteMany({ userId: id })
			.where('provider')
			.equals('spotify')
			.exec();
	} catch {
		throw { message: `Error deleting sessions for ${id}` };
	}
}
