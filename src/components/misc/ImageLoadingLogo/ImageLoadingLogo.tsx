import DynamicLogo from '../LogoToAnimate';

import local from './ImageLoadingLogo.module.scss';

const ImageLoadingLogo = () => {
	return (
		<DynamicLogo
			left={[local.left]}
			middle={[local.middle]}
			right={[local.right]}
		/>
	);
};

export default ImageLoadingLogo;
