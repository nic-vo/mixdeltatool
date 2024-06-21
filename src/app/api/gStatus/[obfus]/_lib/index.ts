import mongoosePromise from '@/lib/database/mongoose/connection';
import {
	GlobalStatus,
	GlobalStatusPointer,
} from '@/lib/database/mongoose/models';
import { badResponse } from '@/lib/route_helpers';

export async function setNewGlobalStatus({
	status,
	statusType,
}: {
	status: string;
	statusType: 'ok' | 'concern' | 'severe';
}) {
	let session;
	try {
		const db = await mongoosePromise();
		if (!db) throw new Error();
		session = await db.startSession();
	} catch {
		return badResponse(502, { message: 'Error connecting to database' });
	}

	try {
		session.startTransaction();
		const newStatus = new GlobalStatus({
			status,
			statusType,
			active: Date.now(),
		});
		let currentPointer = await GlobalStatusPointer.findOne().exec();
		if (currentPointer === null) {
			currentPointer = new GlobalStatusPointer({ current: newStatus._id });
		}
		currentPointer.current = newStatus._id;
		await newStatus.save();
		await currentPointer.save();
		await session.commitTransaction();
	} catch {
		await session.abortTransaction();
		return badResponse(502, { message: 'There was a database error' });
	}
	return Response.json({ message: 'Created' }, { status: 201 });
}
