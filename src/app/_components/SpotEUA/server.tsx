import { PropsWithChildren } from 'react';

export const EUAList = (
	props: PropsWithChildren & { ordered: boolean; listStyle?: string }
) => {
	const classer = 'flex flex-col gap-6 pl-6';
	const { children, ordered, listStyle } = props;
	if (ordered)
		return (
			<ol
				className={classer}
				style={listStyle ? { listStyleType: listStyle } : {}}>
				{children}
			</ol>
		);
	return (
		<ul
			className={classer}
			style={listStyle ? { listStyleType: listStyle } : {}}>
			{children}
		</ul>
	);
};

export const EUALIContainer = (props: PropsWithChildren) => {
	return (
		<li>
			<section>{props.children}</section>
		</li>
	);
};
