import Link, { LinkProps } from 'next/link';
import {
	AnchorHTMLAttributes,
	ButtonHTMLAttributes,
	PropsWithChildren,
} from 'react';

type GlobalButtonProps = PropsWithChildren &
	ButtonHTMLAttributes<HTMLButtonElement>;
type GlobalLinkProps = PropsWithChildren &
	Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> &
	Omit<LinkProps, 'href'> & { href: string };

const globalClasser = (className?: string) =>
	`flex items-center justify-center relative py-2 px-8 border-2 rounded-full border-white bg-transparent hover:text-black focus-visible:text-black outline-none transition-colors before:absolute before:h-full before:w-[102%] before:top-0 before:left-0 overflow-hidden before:-translate-x-full before:transition-transform hover:before:translate-x-0 focus-visible:before:translate-x-0 text-center font-hind font-bold disabled:opacity-25 disabled:cursor-not-allowed before:disabled:opacity-0 disabled:text-white hover:disabled:border-white before:bg-white${
		(className && ` ${className}`) ?? ''
	}`;

export const GlobalBlockLink = (props: GlobalLinkProps) => {
	const attrs = { ...props, children: null, prefetch: false };
	if (/^\//.test(props.href))
		return (
			<Link
				{...attrs}
				className={globalClasser(props.className)}>
				<span className='block relative z-10'>{props.children}</span>
			</Link>
		);
	return (
		<a
			{...attrs}
			className={globalClasser(props.className)}>
			<span className='block relative z-10'>{props.children}</span>
		</a>
	);
};

export const GlobalButton = (props: GlobalButtonProps) => {
	const attrs = { ...props, children: null };
	return (
		<button
			{...attrs}
			className={globalClasser(props.className)}>
			<span className='relative z-10'>{props.children}</span>
		</button>
	);
};

export const InlineLink = (props: GlobalLinkProps) => {
	const attrs = { ...props, children: null };
	const inlineClasser = (className?: string) =>
		`font-bold underline underline-offset-4 outline-myteal focus-visible:outline outline-offset-2 rounded-md${
			(className && ` ${className}`) ?? ''
		}`;
	if (/^\//.test(props.href))
		return (
			<Link
				{...attrs}
				className={inlineClasser(props.className)}>
				<span className='relative z-10'>{props.children}</span>
			</Link>
		);
	return (
		<a
			{...attrs}
			className={inlineClasser(props.className)}>
			<span className='relative z-10'>{props.children}</span>
		</a>
	);
};

export const GlobalMain = (
	props: PropsWithChildren & { className?: string }
) => (
	<main
		className={
			'relative flex flex-col items-center gap-4 w-10/12 z-10' +
			((props.className && ` ${props.className}`) ?? '')
		}>
		{props.children}
	</main>
);
