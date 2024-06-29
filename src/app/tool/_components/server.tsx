import { PropsWithChildren } from 'react';

export const ToolHeading = (props: PropsWithChildren) => (
	<h1 className='font-cabin font-black text-6xl'>{props.children}</h1>
);
