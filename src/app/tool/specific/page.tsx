import { GlobalMain } from '@/components/global/serverComponentUI';
import { ToolHeading } from '../_components/server';
import { SpecificAdder, SpecificList } from './_components';

const SpecificDialogue = () => (
	<GlobalMain>
		<ToolHeading>Add specific playlists</ToolHeading>
		<SpecificAdder />
		<SpecificList />
	</GlobalMain>
);

export default SpecificDialogue;
