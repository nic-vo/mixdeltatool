import ContactForm, { HCaptchaBlock } from './_components/form';
import { GlobalMain, InlineLink } from '@/components/global/serverComponentUI';
import { SmallNav } from '@/components/global/bodyText';
import Script from 'next/script';
import { ToolHeading } from '../tool/_components/server';

const Contact = () => (
	<GlobalMain className='mt-8 gap-4'>
		<Script src='https://js.hcaptcha.com/1/api.js?render=explicit' />
		<ToolHeading>Comments? Questions?</ToolHeading>
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
	title: 'Contact Us',
	description: 'The MixDelta contact form',
};
