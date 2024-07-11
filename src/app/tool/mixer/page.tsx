import { GlobalMain } from '@/components/global/serverComponentUI';
import { ToolHeading } from '../_components/server';
import MixerForm from './_components';

const DifferDialogue = () => (
	<GlobalMain className='m-auto'>
		<ToolHeading className='text-center'>
			<span className='text-pinkred'>Mix</span> Playlists
		</ToolHeading>
		<MixerForm />
	</GlobalMain>
);

export default DifferDialogue;
