import {
	FaExclamationTriangle,
	FaExclamationCircle,
	FaCheckCircle
} from 'react-icons/fa';

import local from './ServiceStatus.module.scss';

const ServiceStatus = (props: {
	status: string,
	statusType: string,
	active: number
}) => {
	const { status, statusType, active } = props;
	const current = new Date(Math.floor(active / 60000) * 60000);

	const divClasser = `${local.container} ${statusType === 'severe' ? local.severe
		: statusType === 'ok' ? local.ok : local.concern}`;

	return (
		<section className={divClasser}>
			{
				statusType === 'severe' ? <FaExclamationTriangle /> :
					statusType === 'ok' ? <FaCheckCircle /> : <FaExclamationCircle />
			}

			<div className={local.info}>
				<p><strong>{current.getMonth() + 1}/{current.getDate()} @ {current.toLocaleTimeString().replace(/:00 /, ' ')}</strong></p>
				<p>{status}</p>
			</div>
		</section>
	);
}

export default ServiceStatus;
