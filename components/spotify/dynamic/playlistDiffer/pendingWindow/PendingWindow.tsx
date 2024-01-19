import { useContext } from 'react';
import { DifferContext } from '../../contexts/DifferProvider';
import { FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

import local from './PendingWindow.module.scss';
import global from '@styles/globals.module.scss';
import { ListItem, LoadingLogo } from '@components/misc';

const PendingWindow = () => {
	const {
		loading,
		error,
		success,
		target,
		differ,
		goToForm
	} = useContext(DifferContext);

	const statusClass = loading === true ? local.loading
		: error !== null ? local.error
			: success === null ? '' : success.length === 1 ? local.total : local.partial;
	const headingClasser = `${local.heading} ${statusClass}`
	const sectionClasser = `${local.status} ${statusClass}`

	return (
		<section className={local.pending}>
			<h2 className={headingClasser}>
				{
					loading ? 'Pending...'
						: error !== null ? 'Something went wrong.'
							: success === null ? 'Pending...'
								: success.length > 1 ? 'Partial success...' : 'Total success!'
				}
			</h2>
			<section className={local.singles}>
				{target !== '' && <ListItem playlist={target} />}
				<div className={sectionClasser}>
					{
						loading ? <LoadingLogo />
							: error !== null ? <FaExclamationCircle />
								: <FaCheckCircle />
					}
				</div>
				{differ !== '' && <ListItem playlist={differ} />}
			</section>
			{success !== null && success.length > 0 && (
				<ul>
					{success.map((thing, index) => {
						return <li key={`partial-${index}`}>{thing}</li>
					})}
				</ul>
			)}
			{error !== null && <p className={local.error}>{error}</p>}
			{!loading && <button
				disabled={loading}
				onClick={() => goToForm()}
				className={global.emptyButton}>
				Do it again...
			</button>}
		</section>
	);
}

export default PendingWindow;
