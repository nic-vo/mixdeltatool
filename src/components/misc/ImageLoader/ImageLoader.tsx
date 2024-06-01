import { useState } from 'react';
import { MixDeltaLogo } from '@/consts/spotify';

import local from './ImageLoader.module.scss';
import ImageLoadingLogo from '../ImageLoadingLogo/ImageLoadingLogo';

const ImageLoader = (props: {
	url?: string | null | undefined;
	alt?: string;
}) => {
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

	const containerClass = `${local.container}${
		!error && !loaded && props.url ? ` ${local.loading}` : ''
	}`;
	const imgClass = `${local.img}${loaded ? ` ${local.loaded}` : ''}`;

	if (props.url === null || props.url === undefined || error)
		return (
			<div className={containerClass}>
				<img
					src={MixDeltaLogo.src}
					alt={`Album art placeholder`}
					className={imgClass}
				/>
			</div>
		);

	return (
		<div className={containerClass}>
			{!loaded && <ImageLoadingLogo />}
			<img
				src={props.url !== null ? props.url : ''}
				alt={props.alt ? props.alt : ''}
				onLoad={loadHandler}
				onError={errorHandler}
				loading='lazy'
				className={imgClass}
			/>
		</div>
	);
};

export default ImageLoader;
