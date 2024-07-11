import { GlobalMain } from '@/components/global/serverComponentUI';
import { FormEventHandler, HTMLAttributes, PropsWithChildren } from 'react';
import { IoAlertCircleSharp } from 'react-icons/io5';

export const ToolHeading = ({
	children,
	className,
}: PropsWithChildren & { className?: string }) => (
	<h1
		className={`font-cabin font-black text-4xl md:text-6xl lg:w-full${
			className ? ` ${className}` : ''
		}`}>
		{children}
	</h1>
);

export const SmallStatus = ({
	error,
	loading,
}: {
	error?: string | null;
	loading?: boolean;
}) => (
	<div
		aria-live='assertive'
		aria-busy={loading}
		role='alert'>
		<div className='flex gap-2 items-center min-h-8'>
			{error ? (
				<>
					<IoAlertCircleSharp
						aria-hidden
						className='text-red-500 text-2xl block'
					/>
					<p className='block leading-none'>{error}</p>
				</>
			) : (
				<p className={`italic ${loading ? 'text-inherit' : 'text-slate-500'}`}>
					{loading ? 'loading...' : 'waiting...'}
				</p>
			)}
		</div>
	</div>
);

export const AdderMain = (props: PropsWithChildren) => (
	<GlobalMain className='gap-y-8 max-w-screen-2xl'>{props.children}</GlobalMain>
);

export const ListContainer = (props: PropsWithChildren) => (
	<section className='relative flex flex-col items-center gap-8 overflow-hidden h-full after:z-10 after:absolute after:w-full after:h-8 after:bottom-0 after:bg-gradient-to-t after:from-black after:to-transparent'>
		{props.children}
	</section>
);

export const ListUL = (
	props: PropsWithChildren & Omit<HTMLAttributes<HTMLUListElement>, 'className'>
) => (
	<ul
		{...props}
		className='relative flex w-full justify-center flex-wrap gap-8 overflow-auto outline-white focus-visible:outline -outline-offset-2 pr-2 pb-8 rounded-xl '>
		{props.children}
	</ul>
);

export const AdderForm = (
	props: PropsWithChildren & {
		onReset?: FormEventHandler;
		onSubmit: FormEventHandler;
	}
) => (
	<form
		onSubmit={props.onSubmit}
		onReset={props.onReset}
		className='flex flex-col gap-2'>
		{props.children}
	</form>
);
