import { FetchError } from '@lib/errors';
import mongoosePromise from './connection';
import {
	GlobalStatus,
	GlobalStatusPointer
} from './models';

import { NextApiRequest } from 'next';

export async function getGlobalStatusProps() {
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
		let currentPointer = await GlobalStatusPointer.findOne().exec();
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

export function CORSGet(req: NextApiRequest) {
	if (process.env.IS_DEV === 'YES'
		&& req.headers.origin) {
		return req.headers.origin;
	}
	if (!req.headers.origin
		|| req.headers.origin !== process.env.SAFE_ORIGIN)
		return 'https://mixdeltatool.vercel.app';
	return req.headers.origin;
}

export async function setNewGlobalStatus(params:
	{
		status: string,
		statusType: 'ok' | 'concern' | 'status'
	}) {
	const { status, statusType } = params;
	try {
		await mongoosePromise();
	} catch {
		throw new FetchError('There was an error connecting to MongoDB');
	}
	const newStatus = new GlobalStatus({
		status, statusType, active: Date.now()
	});
	try {
		let currentPointer = await GlobalStatusPointer.findOne().exec();
		if (currentPointer === null) {
			currentPointer = new GlobalStatusPointer({ current: newStatus._id });
		}
		currentPointer.current = newStatus._id;
		await Promise.all([newStatus.save(), currentPointer.save()]);
	} catch {
		throw new FetchError('There was an error creating a new status');
	}
	return null;
}
