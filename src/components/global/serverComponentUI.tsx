import Link from 'next/link';
import {
	AnchorHTMLAttributes,
	forwardRef,
	ButtonHTMLAttributes,
	PropsWithChildren,
} from 'react';
import { twMerge as merge } from 'tailwind-merge';

export type GlobalButtonProps = PropsWithChildren &
	ButtonHTMLAttributes<HTMLButtonElement>;
export type GlobalLinkProps = PropsWithChildren &
	AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

const globalClasser = (className?: string) =>
	merge(
		'flex items-center justify-center relative py-2 px-8 border-2 rounded-full border-slate-500 bg-transparent hover:text-black focus-visible:text-black hover:border-white focus-visible:border-white outline-none transition-all after:absolute after:h-full after:w-[102%] after:top-0 after:left-0 overflow-hidden after:-translate-x-full after:transition-all hover:after:translate-x-0 focus-visible:after:translate-x-0 text-center font-karla font-medium disabled:opacity-25 disabled:cursor-not-allowed after:disabled:opacity-0 disabled:text-slate-500 hover:disabled:border-slate-500 after:bg-white disabled:border-slate-500',
		className ? className : ''
	);

export const GlobalBlockLink = ({
	href,
	className,
	children,
	...attrs
}: GlobalLinkProps) =>
	/^\//.test(href) ? (
		<Link
			{...attrs}
			href={href}
			className={globalClasser(className)}
			prefetch={false}>
			{children}
		</Link>
	) : (
		<a
			{...attrs}
			className={globalClasser(className)}>
			{children}
		</a>
	);

export const GlobalButton = forwardRef<HTMLButtonElement, GlobalButtonProps>(
	function GlobalButton(
		{ className, children, ...attrs }: GlobalButtonProps,
		ref
	) {
		return (
			<button
				{...attrs}
				ref={ref}
				className={globalClasser(className)}>
				{children}
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
	`font-bold underline underline-offset-4 outline-lightteal focus-visible:outline outline-offset-2 rounded-md${
		(className && ` ${className}`) ?? ''
	}`;

export const InlineLink = ({
	href,
	className,
	children,
	...attrs
}: GlobalLinkProps) => {
	if (/^\//.test(href))
		return (
			<Link
				{...attrs}
				href={href}
				prefetch={false}
				className={inlineClasser(className)}>
				{children}
			</Link>
		);
	return (
		<a
			{...attrs}
			href={href}
			className={inlineClasser(className)}>
			{children}
		</a>
	);
};

const mainClasser = (className?: string) =>
	`relative flex flex-col items-center gap-4 w-10/12 flex-grow flex-shrink z-10 overflow-hidden${
		className ? ` ${className}` : ''
	}`;

export const GlobalMain = ({
	children,
	className,
}: PropsWithChildren & { className?: string }) => (
	<main
		className={mainClasser(className)}
		aria-live='polite'
		aria-busy={false}>
		{children}
	</main>
);
