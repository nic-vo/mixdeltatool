import {
	GlobalBlockLink,
	GlobalButton,
	GlobalButtonProps,
	GlobalLinkProps,
} from '@/components/global/serverComponentUI';

export const FlatLink = (props: GlobalLinkProps) => (
	<GlobalBlockLink
		{...props}
		className={
			'rounded-none border-x-0 w-full text-black hover:text-white focus-visible:text-white after:bg-black border-black hover:border-black focus-visible:border-black' +
			(props.className ? ` ${props.className}` : '')
		}>
		{props.children}
	</GlobalBlockLink>
);

export const FlatButton = ({
	children,
	className,
	...attrs
}: GlobalButtonProps) => (
	<GlobalButton
		{...attrs}
		className={
			'rounded-none border-x-0 w-full text-black hover:text-white focus-visible:text-white after:bg-black border-black hover:border-black focus-visible:border-black' +
			(className ? ` ${className}` : '')
		}>
		{children}
	</GlobalButton>
);
