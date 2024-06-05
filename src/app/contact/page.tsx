import local from '@/styles/contact.module.scss';
import Link from 'next/link';
import ContactForm from './_components/form';

const Contact = () => {
	return (
		<main className='flex flex-col p-4 gap-8 w-full max-w-screen-md m-auto self-center justify-self-center'>
			<h1 className={local.h1}>Contact us!</h1>
			<p className='text-center'>
				You can contact us via this form or by emailing{' '}
				<a
					href='mailto:mixdeltatool@gmail.com'
					target='_blank'
					className='underline font-bold'>
					mixdeltatool@gmail.com
				</a>
				.
			</p>
			<ContactForm />
			<nav className='w-full flex justify-between p-4 mt-auto'>
				<Link
					href='/'
					prefetch={false}
					className='p-4 border-b-2 border-b-white hover:bg-white hover:text-black focus-visible:bg-white focus-visible:text-black'>
					&larr; Back home
				</Link>
				<Link
					href='/tool'
					prefetch={false}
					className='p-4 border-b-2 border-b-white hover:bg-white hover:text-black focus-visible:bg-white focus-visible:text-black'>
					To the tool &rarr;
				</Link>
			</nav>
		</main>
	);
};

export default Contact;

export const metadata = {
	title: 'Contact Us | MixDelta',
	description: 'The MixDelta contact form',
};
