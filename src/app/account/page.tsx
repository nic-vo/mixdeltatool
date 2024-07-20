import { auth } from '@/auth';
import { GlobalMain, InlineLink } from '@/components/global/serverComponentUI';
import { redirect } from 'next/navigation';
import { SmallNav } from '@/components/global/bodyText';
import DeleteForm from './_components/DeleteForm';

export default async function AccountDeletionPage() {
	const session = await auth();
	if (!session) redirect('/login');

	return (
		<GlobalMain className='!gap-8 pt-16'>
			<h1 className='font-cabin font-black text-5xl lg:text-6xl text-center'>
				Request Account Deletion
			</h1>
			<p className='max-w-prose'>
				This form will delete any data retained by MixDelta that is unique to
				your account and Spotify profile. It won&apos;t affect any playlists
				you&apos;ve already created with the tool, nor will it affect any data
				on your Spotify account.
			</p>
			<p className='max-w-prose'>
				After using this form to delete your account, visit{' '}
				<InlineLink
					href='https://accounts.spotify.com'
					target='_blank'>
					accounts.spotify.com
				</InlineLink>{' '}
				to disconnect MixDelta from your Spotify account.
			</p>
			<DeleteForm />
			<section className='w-full max-w-prose flex flex-col items-center gap-4'>
				<h2 className='font-cabin font-bold text-2xl text-center text-pinkred'>
					Here by mistake?
				</h2>
				<SmallNav />
			</section>
		</GlobalMain>
	);
}
