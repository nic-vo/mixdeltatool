import {
	IoWarningSharp,
	IoAlertCircleSharp,
	IoCheckmarkCircle,
} from 'react-icons/io5';
import { getGlobalStatusProps } from '@/lib/database/mongoose';

import local from './ServiceStatus.module.scss';

const AlertSVG = ({ statusType }: { statusType: string }) => {
	if (statusType === 'severe') return <IoWarningSharp aria-hidden={true} />;
	if (statusType === 'ok') return <IoCheckmarkCircle aria-hidden={true} />;
	return <IoAlertCircleSharp aria-hidden={true} />;
};

export default async function ServiceStatus() {
	const { status, statusType, active } = await getGlobalStatusProps();
	const current = new Date(Math.floor(active / 60000) * 60000);

	const divClasser = `${local.container} ${
		statusType === 'severe'
			? local.severe
			: statusType === 'ok'
			? local.ok
			: local.concern
	}`;

	return (
		<div
			className={`w-full max-w-prose flex items-center self-center gap-4 p-4 rounded-xl border-2`}
			role={statusType === 'ok' ? 'none' : 'status'}>
			<AlertSVG statusType={statusType} />
			<div className={local.info}>
				<p>
					<strong>
						{current.getMonth() + 1}/{current.getDate()} @{' '}
						{current.toLocaleTimeString().replace(/:00 /, ' ')}
					</strong>
				</p>
				<p>{status}</p>
			</div>
		</div>
	);
}
