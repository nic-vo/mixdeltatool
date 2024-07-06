import Link from 'next/link';
import {
	AnchorHTMLAttributes,
	forwardRef,
	ButtonHTMLAttributes,
	PropsWithChildren,
} from 'react';

export type GlobalButtonProps = PropsWithChildren &
	ButtonHTMLAttributes<HTMLButtonElement>;
export type GlobalLinkProps = PropsWithChildren &
	AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

const globalClasser = (className?: string) =>
	`flex items-center justify-center relative py-2 px-8 border-2 rounded-full border-white bg-transparent hover:text-black focus-visible:text-black outline-none transition-all before:absolute before:h-full before:w-[102%] before:top-0 before:left-0 overflow-hidden before:-translate-x-full before:transition-all hover:before:translate-x-0 focus-visible:before:translate-x-0 text-center font-karla font-medium disabled:opacity-25 disabled:cursor-not-allowed before:disabled:opacity-0 disabled:text-white hover:disabled:border-white before:bg-white${
		(className && ` ${className}`) ?? ''
	}`;

export const GlobalBlockLink = (props: GlobalLinkProps) =>
	/^\//.test(props.href) ? (
		<Link
			{...props}
			href={props.href}
			className={globalClasser(props.className)}
			prefetch={false}>
			{props.children}
		</Link>
	) : (
		<a
			{...props}
			className={globalClasser(props.className)}>
			{props.children}
		</a>
	);

export const GlobalButton = forwardRef<HTMLButtonElement, GlobalButtonProps>(
	function GlobalButton(props: GlobalButtonProps, ref) {
		const attrs = { ...props, children: null };
		return (
			<button
				{...attrs}
				ref={ref}
				className={globalClasser(props.className)}>
				{props.children}
			</button>
		);
	}
);

export const GlobalTextWrapper = (
	props: PropsWithChildren & {
		sr?: boolean;
		'aria-hidden'?: boolean;
		className?: string;
		suppressHydrationWarning?: boolean;
	}
) => {
	const classer = (className?: string) =>
		`${
			props.sr
				? 'sr-only'
				: `block relative z-10${className ? ` ${className}` : ''}`
		}`;
	return (
		<span
			className={classer(props.className)}
			aria-hidden={props['aria-hidden']}
			suppressHydrationWarning={props.suppressHydrationWarning}>
			{props.children}
		</span>
	);
};

const inlineClasser = (className?: string) =>
	`font-bold underline underline-offset-4 outline-myteal focus-visible:outline outline-offset-2 rounded-md${
		(className && ` ${className}`) ?? ''
	}`;

export const InlineLink = (props: GlobalLinkProps) => {
	if (/^\//.test(props.href))
		return (
			<Link
				{...props}
				href={props.href}
				prefetch={false}
				className={inlineClasser(props.className)}>
				{props.children}
			</Link>
		);
	return (
		<a
			{...props}
			className={inlineClasser(props.className)}>
			{props.children}
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
