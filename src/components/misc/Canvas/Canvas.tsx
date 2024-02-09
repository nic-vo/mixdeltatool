import { useEffect, useRef, useState, useMemo } from 'react';

const Canvas = (props: {
	fps: number,
	draw: (args: { ctx: CanvasRenderingContext2D, frame: number, init: any }) => void,
	initializer: (args: { height: number, width: number }) => {},
	predraw?: (ctx: CanvasRenderingContext2D) => void,
	postdraw?: (ctx: CanvasRenderingContext2D) => void,
	animated: boolean
}) => {
	const { draw, predraw, postdraw, animated } = props;
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const elapsedRef = useRef<number>(0);

	const [width, setWidth] = useState(0);
	const [height, setHeight] = useState(0);
	const [error, setError] = useState('');

	const memoizedInit = useMemo(() => {
		return props.initializer({ height, width })
	}, [height, width, props.initializer]);

	useEffect(() => {
		if (error !== '') return;
		const canvas = canvasRef.current;
		if (canvas === null) {
			setError('There was an error with the canvas');
			return;
		}
		const context = canvas.getContext('2d');
		if (context === null) {
			setError('There was an error with the canvas');
			return;
		}

		let frame = elapsedRef.current;
		let animationFrameId: number;
		let last = Date.now();

		if (animated) {
			const render = () => {
				const rn = Date.now();
				if (rn - last > 1000 / props.fps) {
					frame += 1;
					last = rn;
					if (predraw) predraw(context);
					draw({ ctx: context, frame, init: memoizedInit });
				}
				animationFrameId = requestAnimationFrame(render);
			}
			render();
		}

		return () => {
			elapsedRef.current = frame;
			window.cancelAnimationFrame(animationFrameId);
			const render = () => {
				if (predraw) predraw(context);
				draw({ ctx: context, frame, init: memoizedInit })
			}
			requestAnimationFrame(render);
		}
	}, [draw, predraw, postdraw, memoizedInit, error, animated]);

	useEffect(() => {
		const callback = (e?: UIEvent) => {
			const canvas = canvasRef.current;
			if (canvas === null) {
				setError('There was an error with the canvas');
				return;
			}
			const parent = canvas.parentElement;
			const newWidth = parent !== null ?
				parent.getBoundingClientRect().width : window.innerWidth;
			const newHeight = parent !== null ?
				Math.max(parent.getBoundingClientRect().height, window.innerHeight)
				: window.innerHeight;
			setWidth(newWidth);
			setHeight(newHeight);
		}
		callback();
		window.addEventListener('resize', callback);
		return () => window.removeEventListener('resize', callback);
	}, []);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (canvas === null) {
			setError('There was an error with the canvas');
			return;
		}
		canvas.height = height === 0 ? document.documentElement.clientHeight : height;
		canvas.width = width === 0 ? document.documentElement.clientWidth : width;
	}, [width, height]);

	if (error !== '') return <p style={{
		backgroundColor: '#121218',
		position: 'absolute',
		top: 0,
		left: 0,
		zIndex: 0
	}}>{error}</p>;

	return (
		<canvas
			ref={canvasRef}
			style={{
				backgroundColor: '#121218',
				position: 'absolute',
				top: 0,
				left: 0,
				zIndex: 0
			}}
			id='canvas' />
	);
}

export default Canvas;
