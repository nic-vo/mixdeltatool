import { unstable_cache } from 'next/cache';
import mongoosePromise from './connection';
import { GlobalStatus, GlobalStatusPointer } from './models';
import badResponse from '@/lib/returners';

async function internalGetGlobalStatus(): Promise<{
	status: string;
	active: number;
	statusType: 'concern' | 'ok' | 'severe';
}> {
	let status = 'There may be an issue with our servers; please stand by.';
	let statusType: 'concern' | 'severe' | 'ok' = 'concern';

	try {
		const db = await mongoosePromise();
		if (!db) throw 'Error connecting to MongoDB';
		const session = await db.startSession();
		let oneFlag = true;
		while (oneFlag) {
			try {
				session.startTransaction();
				let currentPointer = await GlobalStatusPointer.findOne().exec();
				// If no pointer document, initiate all
				if (currentPointer === null) {
					const newStatus = new GlobalStatus({
						status,
						statusType,
						active: Date.now(),
					});
					currentPointer = new GlobalStatusPointer({ current: newStatus._id });
					await currentPointer.save();
					await newStatus.save();
					await session.commitTransaction();
					break;
				}

				const statusData = await GlobalStatus.findById(
					currentPointer.current
				).exec();
				// If pointer points at existing, return existing
				if (statusData !== null) {
					status = statusData.status;
					statusType = statusData.statusType;
					await session.abortTransaction();
					break;
				}

				console.log('creating fallback');
				const newStatus = new GlobalStatus({
					status,
					statusType,
					active: Date.now(),
				});
				currentPointer.current = newStatus._id;
				await currentPointer.save();
				await newStatus.save();
				await session.commitTransaction();
			} catch {
				await session.abortTransaction();
				if (!oneFlag) {
					oneFlag = true;
					continue;
				}
				throw new Error('ACID error');
			}
		}
		return { status, statusType, active: Date.now() };
	} catch (e: any) {
		console.log(e);
		return {
			statusType: 'severe',
			status:
				"Please be patient, there's an error with our servers. We'll be back ASAP.",
			active: Date.now(),
		};
	}
}

export const getGlobalStatusProps = unstable_cache(
	internalGetGlobalStatus,
	['internalGlobalStatus'],
	{ tags: ['internalGlobalStatus'] }
);

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
