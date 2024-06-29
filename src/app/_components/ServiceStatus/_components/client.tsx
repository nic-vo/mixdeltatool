'use client';

import { GlobalButton } from '@/components/global/serverComponentUI';
import { usePathname } from 'next/navigation';
import {
	MouseEventHandler,
	PropsWithChildren,
	Suspense,
	useEffect,
	useRef,
	useState,
} from 'react';
import { IoCloseSharp } from 'react-icons/io5';

const DialogWrapper = (props: PropsWithChildren) => {
	const [closed, setClosed] = useState(false);
	const ref = useRef<HTMLDialogElement>(null);
	const pathname = usePathname();
	const handler: MouseEventHandler<HTMLButtonElement> = () => {
		if (ref.current) ref.current.close();
		setClosed(true);
		return;
	};

	useEffect(() => {
		if (ref.current) ref.current.show();
	}, []);

	useEffect(() => {
		if (ref.current && ref.current.hasAttribute('open')) ref.current.focus();
	}, [pathname]);

	if (closed) return null;

	return (
		<dialog
			className='fixed bottom-4 z-50 w-10/12 max-w-prose self-center gap-4 p-4 rounded-xl border-4 border-white bg-black text-white focus-visible:text-black focus-within:text-black focus-visible:bg-white focus-within:bg-white outline-none transition-all font-hind'
			role='status'
			aria-label='Service Status'
			ref={ref}>
			<div className='w-11/12 flex flex-col'>
				<Suspense fallback={<p className='animate-pulse'>Loading...</p>}>
					{props.children}
				</Suspense>
			</div>
			<GlobalButton
				aria-label='Close service status popup'
				className='!absolute size-max top-2 right-2 !p-1 border-2 rounded-full before:!bg-myteal hover:!border-myteal focus-visible:!border-myteal'
				onClick={handler}>
				<IoCloseSharp
					aria-hidden={true}
					className='text-sm'
				/>
			</GlobalButton>
		</dialog>
	);
};

export default DialogWrapper;
