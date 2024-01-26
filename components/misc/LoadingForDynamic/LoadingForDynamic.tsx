import ImageLoadingLogo from '../ImageLoadingLogo/ImageLoadingLogo';

export default function LoadingForDynamic(props: {
	error?: Error | null,
	pastDelay?: boolean,
	timedOut?: boolean
}) {
	const { error, pastDelay, timedOut } = props;
	if ((error !== undefined && error !== null)
		|| pastDelay === true
		|| timedOut === true) return <h1>Please refresh page.</h1>;
	return (
		<div style={{ maxWidth: '50%', margin: 'auto' }}>
			<h1 style={{
				alignSelf: 'center',
				textAlign: 'center'
			}}>
				<ImageLoadingLogo /> Loading...
			</h1>
		</div>
	);
}
