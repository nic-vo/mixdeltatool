import { Loading } from '@components/misc';
import dynamic from 'next/dynamic';

const SpotifyMain = dynamic(() => import('./SpotifyMain'), {
	loading: (props: {
		error?: Error | null,
		pastDelay?: boolean,
		timedOut?: boolean
	}) => <Loading
			error={props.error}
			pastDelay={props.pastDelay}
			timedOut={props.timedOut} />,
	ssr: false
});

export {
	SpotifyMain,
};
