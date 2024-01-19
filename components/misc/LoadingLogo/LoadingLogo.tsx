import DynamicLogo from '../LogoToAnimate/LogoToAnimate';

import local from './LoadingLogo.module.scss';

const LoadingLogo = () => {
	return (
		<DynamicLogo
			left={[local.left]}
			middle={[local.middle]}
			right={[local.right]} />
	)
}
export default LoadingLogo
