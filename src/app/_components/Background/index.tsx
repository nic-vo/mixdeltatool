'use client';

import { useCallback, useContext } from 'react';
import Canvas from './Canvas';
import MotionContext from './MotionContext';
import {
	GlobalButton,
	GlobalTextWrapper,
} from '@/components/global/serverComponentUI';
import { IoPause, IoPlay } from 'react-icons/io5';

type FieldsInitValues = {
	size: number;
	predrawY: number;
	posX: number;
	period: number;
	hue: number;
	totalY: number;
};

const DEFAULT_FPS = 30;

const Background = (props: { fps?: number }) => {
	const { animated } = useContext(MotionContext);

	const predraw = useCallback((ctx: CanvasRenderingContext2D) => {
		const { height, width } = ctx.canvas;
		ctx.clearRect(0, 0, width, height);
	}, []);

	const draw = useCallback(
		(args: {
			ctx: CanvasRenderingContext2D;
			frame: number;
			init: FieldsInitValues[];
		}) => {
			const { ctx, frame, init } = args;
			ctx.globalCompositeOperation = 'hard-light';
			for (const square of init) {
				const { posX, predrawY, hue, size, period, totalY } = square;
				const percentOfPeriod = (frame % period) / period;
				const currentYPercent =
					((predrawY + totalY * percentOfPeriod) % totalY) - size;
				ctx.fillStyle = `hsl(${hue}, 50%, 50%)`;
				ctx.beginPath();
				ctx.roundRect(posX, currentYPercent, size, size, Math.floor(size / 4));
				ctx.fill();
			}
		},
		[]
	);

	const drawInit = useCallback(
		(args: { height: number; width: number }): FieldsInitValues[] => {
			const { height, width } = args;
			// EVERYTHING is percents
			let empty: FieldsInitValues[] = [];
			for (let i = 0; i < 20; i++) {
				const size = Math.floor((0.04 + Math.random() * 0.04) * width);
				const rawX = // X starting position
					Math.random() >= 0.5
						? width - Math.random() * size
						: Math.random() * size - size;
				const predrawY = Math.floor(Math.random() * (height + size)); // Y pre-scroll down the page
				const totalY = height + size; // Total distance a shape will travel for the loop, starting offscreen
				const hue =
					Math.random() < 0.5
						? 165 + Math.random() * 30
						: Math.random() < 0.5
						? 344 + Math.random() * 10
						: 22 + Math.random() * 10;
				empty.push({
					size,
					predrawY,
					posX: Math.round(rawX),
					period:
						Math.round(Math.random() * 100 + 20) *
						(props.fps ? props.fps : DEFAULT_FPS),
					totalY,
					hue: Math.round(hue),
				});
			}
			// To describe a particle
			// Size as percentage of parent height
			// Speed / time inversely proportional to size
			// Initial pre-draw distance based on percentage
			// Max travel distance of 0-size to size + canvas height
			// Period as number of seconds * fps
			return empty;
		},
		[]
	);

	return (
		<Canvas
			fps={props.fps || DEFAULT_FPS}
			predraw={predraw}
			initializer={drawInit}
			draw={draw}
			animated={animated}
		/>
	);
};

export default Background;

export const BackgroundToggler = () => {
	const { animated, setAnimated } = useContext(MotionContext);

	return (
		<GlobalButton
			onClick={() => setAnimated(!animated)}
			className='z-20 !fixed left-4 bottom-4 !p-2 backdrop-brightness-[0.2]'
			aria-controls='canvas'>
			{animated ? (
				<IoPause
					aria-hidden={true}
					className='text-lg relative z-10'
				/>
			) : (
				<IoPlay
					aria-hidden={true}
					className='text-lg relative z-10'
				/>
			)}
			<GlobalTextWrapper sr>
				{animated ? 'Pause' : 'Restart'} background animation
			</GlobalTextWrapper>
		</GlobalButton>
	);
};
