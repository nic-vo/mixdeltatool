export default function (props: {
	error?: Error | null,
	pastDelay?: boolean,
	timedOut?: boolean
}) {
	const { error, pastDelay, timedOut } = props;
	if ((error !== undefined && error !== null)
		|| pastDelay === true
		|| timedOut === true) return <p>Please refresh page.</p>;
	return <h1 style={{ textAlign: 'center' }}>Loading...</h1>
}
