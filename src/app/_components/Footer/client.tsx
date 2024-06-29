'use client';

import Link from 'next/link';

import { PropsWithChildren } from 'react';

export const FooterLink = (props: PropsWithChildren & { href: string }) => {
	const handler = () => {
		const dialogs = document.getElementsByTagName('dialog');
		for (const dialog of dialogs) {
			if (!dialog.hasAttribute('open')) continue;
			dialog.focus();
			return;
		}

		const beacon = document.getElementById('beacon');
		if (beacon) beacon.focus();
	};
	return (
		<Link
			onClick={handler}
			href={props.href}
			prefetch={false}
			className='block p-2 focus-visible:outline outline-white rounded-2xl border-transparent border-b-2 hover:border-white hover:rounded-none hover:focus-visible:rounded-none hover:focus-visible:outline-none'>
			{props.children}
		</Link>
	);
};
