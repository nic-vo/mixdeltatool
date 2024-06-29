import LogoToAnimate from '../LogoToAnimate';

import local from './InProgressLogo.module.scss';

const InProgressLogo = (props: { twSize?: string }) => {
	return (
		<LogoToAnimate
			main={[props.twSize ?? '']}
			left={[local.left]}
			middle={[local.middle]}
			right={[local.right]}
			aria-hidden
		/>
	);
};

export default InProgressLogo;
