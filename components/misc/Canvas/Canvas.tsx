import { useEffect, useRef, useState } from 'react';

const Canvas = (props: {
	fps: number,
	draw: (args: { ctx: CanvasRenderingContext2D, startTime: number, init: any }) => void,
	initializer: (args: { height: number, width: number }) => {},
	predraw?: (ctx: CanvasRenderingContext2D) => void,
	postdraw?: (ctx: CanvasRenderingContext2D) => void
}) => {
	const { draw, predraw, postdraw } = props;
	const canvasRef = useRef<HTMLCanvasElement>(null);

	const [width, setWidth] = useState(0);
	const [height, setHeight] = useState(0);
	const [error, setError] = useState('');

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
		const startTime = Date.now();
		let animationFrameId: number;
		let last = Date.now();
		const init = props.initializer({ height, width });

		const render = () => {
			const rn = Date.now();
			if (rn - last > 1000 / props.fps) {
				last = rn;
				if (predraw) predraw(context);
				draw({ ctx: context, startTime, init });
			}
			animationFrameId = requestAnimationFrame(render);
		}
		render();

		return () => {
			window.cancelAnimationFrame(animationFrameId);
		}
	}, [draw, predraw, postdraw, width, height, error]);

	useEffect(() => {
		// const canvas = canvasRef.current;
		// if (canvas === null) {
		// 	setError('There was an error with the canvas');
		// 	return;
		// }
		// const resizeObserver = new ResizeObserver(() => {
		// 	setWidth(canvas.clientWidth);
		// 	setHeight(canvas.clientHeight);
		// });

		// resizeObserver.observe(canvas);
		// return () => resizeObserver.disconnect();

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

	if (error !== '') return (
		<>
			<p>{error}</p>
		</>
	);

	return (
		<>
			<canvas
				ref={canvasRef}
				style={{
					backgroundColor: '#111',
					position: 'absolute',
					top: 0,
					left: 0,
					zIndex: 0
				}}
				id='canvas' />
		</>
	);
}

export default Canvas;
