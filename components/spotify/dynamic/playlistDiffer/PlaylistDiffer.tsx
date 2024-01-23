import DifferForm from './differForm/DifferForm';
import PlaylistOptions from './playlistOptions/PlaylistOptions';
import { useContext } from 'react';
import PendingWindow from './pendingWindow/PendingWindow';
import { DifferContext } from '../contexts/DifferProvider';

import local from './PlaylistDiffer.module.scss';

export default function PlaylistDiffer() {
	const { onForm } = useContext(DifferContext)

	return (
		<section className={local.container}>
			{
				onForm ? (
					<DifferForm>
						<PlaylistOptions />
					</DifferForm>)
					: <PendingWindow />
			}
		</section>
	);
}
