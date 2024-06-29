import ContactForm, { HCaptchaBlock } from './_components/form';
import { GlobalMain, InlineLink } from '@/components/global/serverComponentUI';
import { SmallNav } from '../_components/EUA/server';
import Script from 'next/script';

const Contact = () => (
	<GlobalMain className='mt-8 gap-8'>
		<Script src='https://js.hcaptcha.com/1/api.js?render=explicit' />
		<h1 className='font-cabin text-5xl lg:text-8xl font-black text-center'>
			Comments? Questions?
		</h1>
		<ContactForm>
			<HCaptchaBlock />
		</ContactForm>
		<p className='text-center'>
			You can also email us at{' '}
			<InlineLink
				href='mailto:mixdeltatool@gmail.com'
				target='_blank'>
				mixdeltatool@gmail.com
			</InlineLink>
			.
		</p>
		<SmallNav />
	</GlobalMain>
);
export default Contact;

export const metadata = {
	title: 'Contact Us | MixDelta',
	description: 'The MixDelta contact form',
};
