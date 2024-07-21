import { InlineLink } from '@/components/global/serverComponentUI';
import { AdderMain, ToolHeading } from '../_components/server';
import { UserAdder, UserList } from './_components';
import Image from 'next/image';
import { SpotifyLogo } from '@/consts/spotify';

const UserDialogue = () => (
	<AdderMain>
		<ToolHeading className='col-span-full text-center'>
			Add <span className='text-satorange'>Your</span> Playlists
		</ToolHeading>
		<UserAdder />
		<UserList />
		<p className='flex items-center gap-2 flex-wrap justify-center p-1'>
			<span className='block relative'>All playlist data is provided by </span>
			<InlineLink
				href='https://open.spotify.com'
				target='_blank'>
				<Image
					src={SpotifyLogo}
					alt='Spotify'
					className='h-[71px] w-auto shrink-0'
				/>
			</InlineLink>
		</p>
	</AdderMain>
);

export default UserDialogue;

export const metadata = {
	title: 'Add Your Playlists',
	description: 'Add your playlists locally to the tool from here',
};
