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
			'!rounded-none !border-x-0 w-full text-black hover:text-white focus-visible:text-white before:!bg-black !border-black' +
			(props.className ? ` ${props.className}` : '')
		}>
		{props.children}
	</GlobalBlockLink>
);

export const FlatButton = (props: GlobalButtonProps) => (
	<GlobalButton
		{...props}
		className={
			'!rounded-none !border-x-0 w-full text-black hover:text-white focus-visible:text-white before:!bg-black !border-black' +
			(props.className ? ` ${props.className}` : '')
		}>
		{props.children}
	</GlobalButton>
);
