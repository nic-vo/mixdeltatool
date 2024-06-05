import { ButtonHTMLAttributes, PropsWithChildren } from 'react';

export const GlobalButton = (
	props: PropsWithChildren &
		Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'>
) => {
	const attrs = { ...props, children: null };
	return (
		<button
			{...attrs}
			className='flex flex-col items-center cursor-pointer p-2 border-2 border-white rounded-xl bg-transparent disabled:cursor-not-allowed hover:text-black hover:bg-white focus-visible:text-black focus-visible:bg-white disabled:opacity-20 disabled:bg-transparent disabled:text-inherit'>
			{props.children}
		</button>
	);
};
