import { AdderMain, ToolHeading } from '../_components/server';
import { UserAdder, UserList } from './_components';

const UserDialogue = () => (
	<AdderMain>
		<ToolHeading className='col-span-full text-center'>
			Add <span className='text-satorange'>Your</span> Playlists
		</ToolHeading>
		<UserAdder />
		<UserList />
	</AdderMain>
);

export default UserDialogue;
