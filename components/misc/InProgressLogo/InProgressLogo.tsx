import LogoToAnimate from '../LogoToAnimate/LogoToAnimate';

import local from './InProgressLogo.module.scss';

const InProgressLogo = () => {
	return <LogoToAnimate
		left={[local.left]}
		middle={[local.middle]}
		right={[local.right]} />
}

export default InProgressLogo;
