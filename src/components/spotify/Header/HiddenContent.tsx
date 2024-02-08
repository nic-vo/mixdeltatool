import { signOut } from 'next-auth/react';
import DeleteDialog from './deleteDialog/DeleteDialog';
import { FaPowerOff } from 'react-icons/fa';

import local from './Header.module.scss';

const HiddenContent = () => {
	return (
		<>
			<DeleteDialog />
			<button
				onClick={() => signOut()}
				className={local.flatButton}>
				<FaPowerOff /> Sign out
			</button>
		</>
	);
}

export default HiddenContent;
