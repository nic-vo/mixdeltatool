import { signOut } from 'next-auth/react';

import look from './Header.module.scss';
import DeleteDialog from './DeleteDialog';

const HiddenContent = () => {
	return (
		<section className={look.hidden}>
			<DeleteDialog />
			<button
				onClick={() => signOut()}
				className={look.button}>
				Sign out
			</button>
		</section>
	);
}

export default HiddenContent;
