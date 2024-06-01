import { useSelector } from 'react-redux';
import { selectOnForm } from '@/state/state';

import DifferForm from './differForm/DifferForm';
import PlaylistOptions from './playlistOptions/PlaylistOptions';
import PendingWindow from './pendingWindow/PendingWindow';

import local from './PlaylistDiffer.module.scss';

export default function PlaylistDiffer() {
	const onForm = useSelector(selectOnForm);

	return (
		<section className={local.container}>
			{onForm ? (
				<DifferForm>
					<PlaylistOptions />
				</DifferForm>
			) : (
				<PendingWindow />
			)}
		</section>
	);
}
