import Link from 'next/link';

const NotFound = () => {
	return (
		<div>
			<h2>We couldn&apos;t find what you&apos;re looking for.</h2>
			<Link href='/'>&larr; Return home</Link>
		</div>
	);
};

export default NotFound;
