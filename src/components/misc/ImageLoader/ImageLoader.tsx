'use client';

import { useState } from 'react';
import { MixDeltaLogo } from '@/consts/spotify';
import Image from 'next/image';

const ImageLoader = (props: { url: string; alt: string }) => {
	const [loaded, setLoaded] = useState(false);
	const [error, setError] = useState(false);

	const loadHandler = () => {
		// setTimeout(() => setLoaded(true), 5000);
		setLoaded(true);
		setError(false);
	};

	const errorHandler = () => {
		setError(true);
	};

	if (error)
		return (
			<Image
				src={MixDeltaLogo.src}
				alt={`Album art placeholder`}
				className={`transition-all h-full w-auto opacity-0${
					loaded ? ` opacity-100` : ''
				}`}
			/>
		);

	return (
		<img
			src={props.url !== null ? props.url : ''}
			alt={props.alt ? props.alt : ''}
			onLoad={loadHandler}
			onError={errorHandler}
			loading='lazy'
			className={`transition-all h-full max-h-full max-w-full opacity-0 object-contain${
				loaded ? ` opacity-100` : ''
			}`}
		/>
	);
};

export default ImageLoader;
