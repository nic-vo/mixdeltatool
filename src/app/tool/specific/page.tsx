import { AdderMain, ToolHeading } from '../_components/server';
import { SpecificAdder, SpecificList } from './_components';

const SpecificDialogue = () => (
	<AdderMain>
		<ToolHeading className='col-span-full text-center '>
			Add <span className='text-myteal'>Specific</span> Playlists
		</ToolHeading>
		<SpecificAdder />
		<SpecificList />
	</AdderMain>
);

export default SpecificDialogue;
