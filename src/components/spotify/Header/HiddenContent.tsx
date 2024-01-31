import { signOut } from 'next-auth/react';
import DeleteDialog from './deleteDialog/DeleteDialog';

import local from './Header.module.scss';
import { FaPowerOff } from 'react-icons/fa';

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
