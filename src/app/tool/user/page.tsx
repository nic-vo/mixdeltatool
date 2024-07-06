import { GlobalMain } from '@/components/global/serverComponentUI';
import { ToolHeading } from '../_components/server';
import { UserAdder, UserList } from './_components';

const UserDialogue = () => (
	<GlobalMain>
		<ToolHeading>Add your playlists</ToolHeading>
		<UserAdder />
		<UserList />
	</GlobalMain>
);

export default UserDialogue;
