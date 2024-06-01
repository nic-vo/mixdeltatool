import { FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import { ListItem, InProgressLogo } from '@/components/misc';
import { useDispatch, useSelector } from 'react-redux';
import {
	AppDispatch,
	selectDifferFetch,
	selectDifferForm,
} from '@/state/state';
import { resetToForm } from '@/state/differFormSlice';

import local from './PendingWindow.module.scss';
import global from '@/styles/globals.module.scss';

const PendingWindow = () => {
	const dispatch = useDispatch<AppDispatch>();
	const { loading, error } = useSelector(selectDifferFetch);
	const { success, endPlaylist, target, differ } =
		useSelector(selectDifferForm);
	const goToForm = () => dispatch(resetToForm());

	const statusClass =
		loading === true
			? local.loading
			: error !== null
			? local.error
			: success === null
			? ''
			: success.length === 1
			? local.total
			: local.partial;
	const headingClasser = `${local.heading} ${statusClass}`;
	const sectionClasser = `${local.status} ${statusClass}`;

	return (
		<section className={local.pending}>
			<h2 className={headingClasser}>
				{loading
					? 'Pending...'
					: error !== null
					? 'Something went wrong.'
					: success === null
					? 'Pending...'
					: success.length > 1
					? 'Partial success...'
					: 'Total success!'}
			</h2>
			<section className={local.singles}>
				{endPlaylist === null ? (
					<>
						{target !== '' && <ListItem playlist={target} />}
						<div className={sectionClasser}>
							{loading ? (
								<InProgressLogo />
							) : error !== null ? (
								<FaExclamationCircle />
							) : (
								<FaCheckCircle />
							)}
						</div>
						{differ !== '' && <ListItem playlist={differ} />}
					</>
				) : (
					<ListItem playlist={endPlaylist} />
				)}
			</section>
			{success !== null && success.length > 0 && (
				<ul>
					{success.map((thing, index) => {
						return <li key={`partial-${index}`}>{thing}</li>;
					})}
				</ul>
			)}
			{error !== null && <p className={local.error}>{error}</p>}
			{!loading && (
				<button
					disabled={loading}
					onClick={() => goToForm()}
					className={global.emptyButton}>
					Return
				</button>
			)}
		</section>
	);
};

export default PendingWindow;
