import {
	IoWarningSharp,
	IoAlertCircleSharp,
	IoCheckmarkCircle,
} from 'react-icons/io5';
import getGlobalStatusProps from './_lib';

const AlertSVG = ({
	statusType,
}: {
	statusType: 'ok' | 'severe' | 'concern';
}) => {
	if (statusType === 'severe')
		return (
			<IoWarningSharp
				aria-hidden={true}
				className='text-red-700 text-5xl'
			/>
		);
	if (statusType === 'ok')
		return (
			<IoCheckmarkCircle
				aria-hidden={true}
				className='text-3xl'
			/>
		);
	return (
		<IoAlertCircleSharp
			aria-hidden={true}
			className='text-orange-500 text-5xl'
		/>
	);
};

export default async function ServiceStatus() {
	const { status, statusType, active } = await getGlobalStatusProps();
	const current = new Date(Math.floor(active / 60000) * 60000);

	return (
		<div
			className={`w-full max-w-prose flex items-center self-center gap-4 p-4 rounded-xl border-4 ${
				statusType === 'severe'
					? 'border-red-700 bg-white'
					: statusType === 'ok'
					? 'bg-transparent border-white'
					: 'border-orange-500 bg-white'
			}`}
			role={statusType === 'ok' ? 'none' : 'status'}>
			<AlertSVG statusType={statusType} />
			<div className='flex flex-col gap-2 last:*:border-t last:*:border-t-black pt-2'>
				<p className={statusType === 'ok' ? 'text-white' : 'text-black'}>
					<strong>
						{current.getMonth() + 1}/{current.getDate()} @{' '}
						{current.toLocaleTimeString().replace(/:00 /, ' ')}
					</strong>
				</p>
				<p className={statusType === 'ok' ? 'text-white' : 'text-black'}>
					{status}
				</p>
			</div>
		</div>
	);
}
