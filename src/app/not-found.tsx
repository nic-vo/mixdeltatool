import {
	GlobalBlockLink,
	GlobalMain,
} from '@/components/global/serverComponentUI';

const NotFound = () => {
	return (
		<GlobalMain>
			<h1 className='font-cabin text-7xl text-center w-10/12'>
				We couldn&apos;t find that.
			</h1>
			<GlobalBlockLink href='/'>&larr; Return home</GlobalBlockLink>
		</GlobalMain>
	);
};

export default NotFound;
