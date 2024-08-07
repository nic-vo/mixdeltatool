import mongoosePromise from '@/lib/database/mongoose/connection';
import { Account, Session, User } from '@/lib/database/mongoose/models';
import { badResponse } from '@/lib/route_helpers/responses';

export const userDeleter = async (id: string) => {
	const db = await mongoosePromise();
	if (!db)
		return badResponse(500, {
			message: 'There was an error with our servers. Try again',
		});
	const session = await db.startSession();
	let onceFlag = true;
	while (onceFlag) {
		try {
			session.startTransaction();
			await Account.findOneAndDelete({ userId: id }, { session })
				.where('provider')
				.equals('spotify')
				.exec();
			await User.findByIdAndDelete(id, { session }).exec();
			await session.commitTransaction();
			break;
		} catch {
			await session.abortTransaction();
			if (onceFlag) {
				onceFlag = false;
				continue;
			}
			await session.endSession();
			return badResponse(500, {
				message: 'There was an error with our servers. Try again.',
			});
		}
	}
	await session.endSession();
	return Response.json({ message: 'Deleted' }, { status: 201 });
};

export const sessionDeleter = async (id: string) => {
	try {
		await mongoosePromise();
		let onceFlag = true;
		while (true) {
			try {
				await Session.deleteMany({ userId: id })
					.where('provider')
					.equals('spotify')
					.exec();
				break;
			} catch {
				if (onceFlag) {
					onceFlag = false;
					continue;
				}
				throw new Error();
			}
		}
	} catch {
		return badResponse(500, {
			message: 'There was an error with our servers. Try again',
		});
	}

	return Response.json(
		{ messsage: 'Deleted existing sessions' },
		{ status: 201 }
	);
};
