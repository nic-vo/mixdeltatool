import { FaExclamationTriangle } from 'react-icons/fa';

import local from './SmallStatus.module.scss';

/*

For use with the various getters as a status indicator

*/

const SmallStatus = (props: {
	error?: string | null,
	loading?: boolean
}) => {
	const { error, loading } = props;

	return (
		<div className={local.statusBox}>

			{
				error !== null && error !== undefined ? (
					<>
						<FaExclamationTriangle />
						<div className={local.errorMsgContainer}>
							<p>{error}</p>
						</div>
					</>
				) : (
					<p style={{
						color: loading ? 'inherit' : '#666',
						fontStyle: 'italic'
					}}>
						{loading ? 'loading...' : 'waiting...'}</p>)

			}
		</div >
	)
}

export default SmallStatus;
