import { unstable_cache } from 'next/cache';
import mongoosePromise from '@/lib/database/mongoose/connection';
import {
	GlobalStatus,
	GlobalStatusPointer,
} from '@/lib/database/mongoose/models';
import {
	IoAlertCircleSharp,
	IoCheckmarkCircle,
	IoWarningSharp,
} from 'react-icons/io5';

async function internalGetGlobalStatus(): Promise<{
	status: string;
	active: number;
	statusType: 'concern' | 'ok' | 'severe';
}> {
	let status = 'There may be an issue with our servers; please stand by.';
	let statusType: 'concern' | 'severe' | 'ok' = 'concern';
	let active = Date.now();

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
					await currentPointer.save({ session });
					await newStatus.save({ session });
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
					active = statusData.active;
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
				await currentPointer.save({ session });
				await newStatus.save({ session });
				await session.commitTransaction();
			} catch {
				await session.abortTransaction();
				if (!oneFlag) {
					oneFlag = true;
					continue;
				}
				await session.endSession();
				throw new Error('ACID error');
			}
		}
		await session.endSession();
		return { status, statusType, active };
	} catch (e: any) {
		console.log(e);
		return {
			statusType: 'severe',
			status:
				"Please be patient, there's an error with our servers. We'll be back ASAP.",
			active,
		};
	}
}

const getGlobalStatusProps = unstable_cache(
	internalGetGlobalStatus,
	['internalGlobalStatus'],
	{ tags: ['internalGlobalStatus'] }
);

const AlertSVG = ({
	statusType,
}: {
	statusType: 'ok' | 'severe' | 'concern';
}) => {
	if (statusType === 'severe')
		return (
			<IoWarningSharp
				aria-hidden={true}
				className='text-red-700 text-3xl stroke-black'
			/>
		);
	if (statusType === 'ok')
		return (
			<IoCheckmarkCircle
				aria-hidden={true}
				className='text-green-400 text-3xl stroke-black'
			/>
		);
	return (
		<IoAlertCircleSharp
			aria-hidden={true}
			className='text-orange-400 text-3xl stroke-black'
		/>
	);
};

export default async function ServiceStatus() {
	const { status, statusType, active } = await getGlobalStatusProps();
	const timeDisplay = new Date(active);

	return (
		<div className='relative z-0 flex gap-4 items-center'>
			<AlertSVG statusType={statusType} />
			<p>
				<time
					dateTime={timeDisplay.toISOString()}
					className='font-black'>
					{timeDisplay.toLocaleDateString().replace(/\/\d{4}/, '')} @{' '}
					{timeDisplay.toLocaleTimeString().replace(/:\d{2} /, ' ')}
				</time>
				: {status}
			</p>
		</div>
	);
}
