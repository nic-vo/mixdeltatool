import { IoCheckmarkCircleSharp, IoWarning } from 'react-icons/io5';
import { InProgressLogo } from '@/components/misc';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, selectDifferFetch, selectDifferForm } from '@/state';
import { resetToForm } from '@/state/differFormSlice';
import ListItem from '@/app/tool/_components/ListItem';

import {
	GlobalButton,
	GlobalTextWrapper,
} from '@/components/global/serverComponentUI';
import { flippedSlider, hitsSpotify } from '@/consts/buttonStates';

const headingClasser = (additional: string) =>
	`text-3xl text-center font-bold font-cabin ${additional}`;

const PendingWindow = () => {
	const dispatch = useDispatch<AppDispatch>();
	const { loading, error } = useSelector(selectDifferFetch);
	const { success, endPlaylist, target, differ } =
		useSelector(selectDifferForm);
	const goToForm = () => dispatch(resetToForm());

	return (
		<section
			className='flex flex-col gap-4 items-center'
			aria-live='assertive'
			aria-busy={loading}
			role='status'>
			<h2
				className={headingClasser(
					error ? 'text-red-400' : loading ? 'text-satorange' : 'text-green-500'
				)}>
				{error
					? 'Something went wrong.'
					: loading
					? 'Comparing...'
					: 'Completed.'}
			</h2>
			{!success && (
				<div className='flex flex-col lg:flex-row gap-4 items-center'>
					{target !== '' && <ListItem playlist={target} />}
					{error ? (
						<IoWarning
							className='text-3xl text-red-400'
							aria-hidden
						/>
					) : loading ? (
						<InProgressLogo
							twSize='size-32'
							aria-hidden
						/>
					) : (
						<IoCheckmarkCircleSharp
							className='text-3xl text-green-500'
							aria-hidden
						/>
					)}
					{differ !== '' && <ListItem playlist={differ} />}
				</div>
			)}
			{endPlaylist && <ListItem playlist={endPlaylist} />}
			{success !== null && success.length > 0 && (
				<ul>
					{success.map((thing, index) => {
						return (
							<li
								className='list-disc'
								key={`partial-${index}`}>
								{thing}
							</li>
						);
					})}
				</ul>
			)}
			{error !== null && <p className='text-red-500'>{error}</p>}
			{!loading && (
				<GlobalButton
					disabled={loading}
					className={hitsSpotify + ' ' + flippedSlider}
					onClick={goToForm}>
					<GlobalTextWrapper>Return</GlobalTextWrapper>
				</GlobalButton>
			)}
		</section>
	);
};

export default PendingWindow;
