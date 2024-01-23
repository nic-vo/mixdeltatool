import mongoosePromise, {
	GlobalStatus,
	GlobalStatusPointer
} from '@lib/database/mongoose';

export default async function getGlobalStatus() {
	let status = 'There may be an issue with our servers; please stand by.';
	let statusType = 'concern';
	let active = Date.now();
	try {
		await mongoosePromise();
	} catch {
		return {
			statusType: 'severe',
			status: "Please be patient, there's an error with our servers. We'll be back ASAP.",
			active
		}
	}
	try {
		let currentPointer = await GlobalStatusPointer.findOne();
		if (currentPointer === null) {
			const newStatus = new GlobalStatus({
				status,
				statusType,
				active
			});
			currentPointer = new GlobalStatusPointer({ current: newStatus._id });
			await Promise.all([newStatus.save(), currentPointer.save()]);
		} else {
			const statusData = await GlobalStatus.findById(currentPointer.current).exec();
			if (statusData !== null) {
				status = statusData.status ? statusData.status : status;
				statusType = statusData.statusType ? statusData.statusType : statusType;
				active = statusData.active ? statusData.active : active;
				return { status, statusType, active }
			}
			const newStatus = new GlobalStatus({
				status,
				statusType,
				active
			});
			currentPointer.current = newStatus._id;
			await Promise.all([newStatus.save(), currentPointer.save()]);
		}
	} catch {
		return {
			statusType: 'severe',
			status: "Please be patient, there's an error with our servers. We'll be back ASAP.",
			active: Date.now()
		}
	}
	return { status, statusType, active };
}
