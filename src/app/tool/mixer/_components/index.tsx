'use client';

import MixerForm from './MixerForm';
import PlaylistOptions from './PlaylistOptions';
import PendingWindow from './PendingWindow';
import { useSelector } from 'react-redux';
import { selectOnForm } from '@/state';

const MixerComponent = () => {
	const onForm = useSelector(selectOnForm);

	if (!onForm) return <PendingWindow />;
	return (
		<MixerForm>
			<PlaylistOptions />
		</MixerForm>
	);
};

export default MixerComponent;
