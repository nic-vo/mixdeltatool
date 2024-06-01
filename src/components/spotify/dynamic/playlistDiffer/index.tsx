import { LoadingForDynamic } from '@/components/misc';
import dynamic from 'next/dynamic';

const PlaylistDiffer = dynamic(import('./PlaylistDiffer'), {
	loading: (props: {
		error?: Error | null;
		pastDelay?: boolean;
		timedOut?: boolean;
	}) => (
		<LoadingForDynamic
			error={props.error}
			pastDelay={props.pastDelay}
			timedOut={props.timedOut}
		/>
	),
	ssr: false,
});

export default PlaylistDiffer;
