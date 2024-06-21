import { unstable_cache } from 'next/cache';
import mongoosePromise from '@/lib/database/mongoose/connection';
import {
	GlobalStatus,
	GlobalStatusPointer,
} from '@/lib/database/mongoose/models';

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

const getGlobalStatusProps = unstable_cache(
	internalGetGlobalStatus,
	['internalGlobalStatus'],
	{ tags: ['internalGlobalStatus'] }
);

export default getGlobalStatusProps;
