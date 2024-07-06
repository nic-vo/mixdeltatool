import { PropsWithChildren } from 'react';
import { IoAlertCircleSharp } from 'react-icons/io5';

export const ToolHeading = ({
	children,
	className,
}: PropsWithChildren & { className?: string }) => (
	<h1
		className={`font-cabin font-black text-4xl md:text-6xl${
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
		<div className='flex gap-2 items-center'>
			{error ? (
				<>
					<IoAlertCircleSharp aria-hidden />
					<p>{error}</p>
				</>
			) : (
				<p className={`italic ${loading ? 'text-inherit' : 'text-slate-500'}`}>
					{loading ? 'loading...' : 'waiting...'}
				</p>
			)}
		</div>
	</div>
);
