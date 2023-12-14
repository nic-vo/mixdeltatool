import Canvas from '../Canvas/Canvas';

type FieldsInitValues = {
	size: number,
	predrawY: number,
	posX: number,
	period: number,
	hue: number,
	totalY: number
};

const Background = () => {
	const predraw = (ctx: CanvasRenderingContext2D) => {
		const { height, width } = ctx.canvas;
		ctx.clearRect(0, 0, width, height);
	}

	const draw = (args: {
		ctx: CanvasRenderingContext2D,
		startTime: number,
		init: FieldsInitValues[]
	}) => {
		const { ctx, startTime, init } = args;
		ctx.globalCompositeOperation = 'screen';
		for (const square of init) {
			const frameTime = Date.now();
			const { posX, predrawY, hue, size, period, totalY } = square;
			const percentOfPeriod = (frameTime - startTime) / period;
			const currentYPercent = ((predrawY + (totalY * percentOfPeriod)) % totalY) - size;
			ctx.fillStyle = `hsl(${hue}, 50%, 50%)`;
			ctx.beginPath();
			ctx.roundRect(
				posX,
				currentYPercent,
				size,
				size,
				Math.floor(size / 4));
			ctx.fill();
		}
	}

	const drawInit = (args: { height: number, width: number }): FieldsInitValues[] => {
		const { height, width } = args;
		// EVERYTHING is percents
		let empty: FieldsInitValues[] = [];
		for (let i = 0; i < 12; i++) {
			const size = Math.floor((0.05 + (Math.random() * 0.05)) * width);
			const rawX = Math.random() > 0.5 ? width - (Math.random() * 1.4 * size)
				: (Math.random() * 1.4 * size) - size;
			const predrawY = Math.floor(Math.random() * (height + size));
			const totalY = height + size;
			const hue = Math.random() < 0.5 ?
				165 + Math.random() * 30 :
				Math.random() < 0.5 ?
					344 + Math.random() * 10 :
					22 + Math.random() * 10;
			empty.push({
				size,
				predrawY,
				posX: Math.round(rawX),
				period: Math.round((Math.random() * 90) + 30) * 1000,
				totalY,
				hue: Math.round(hue)
			});
		}
		// To describe a particle
		// Size as percentage of parent height
		// Speed / time inversely proportional to size
		// Initial pre-draw distance based on percentage
		// Max travel distance of 0-size to size + canvas height
		return empty;
	}

	return (
		<Canvas predraw={predraw} initializer={drawInit} draw={draw} />
	);
}

export default Background;
