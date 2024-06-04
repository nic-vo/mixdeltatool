import mongoosePromise, {
	Account,
	Session,
	User,
} from '@/lib/database/mongoose';

export const userDeleter = async (id: string) => {
	const db = await mongoosePromise();
	if (!db) throw new Error();
	const session = await db.startSession();
	let onceFlag = true;
	while (onceFlag) {
		try {
			session.startTransaction();
			await Promise.all([
				Account.findOneAndDelete({ userId: id })
					.where('provider')
					.equals('spotify')
					.exec(),
				User.findByIdAndDelete(id).exec(),
			]);
			session.commitTransaction();
		} catch {
			session.abortTransaction();
			if (onceFlag) {
				onceFlag = false;
				continue;
			}
			throw new Error();
		}
	}
	session.endSession();
	return;
};

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
};
