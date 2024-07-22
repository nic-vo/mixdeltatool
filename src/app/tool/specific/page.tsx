import { InlineLink } from '@/components/global/serverComponentUI';
import { AdderMain, ToolHeading } from '../_components/server';
import { SpecificAdder, SpecificList } from './_components';
import Image from 'next/image';
import { SpotifyLogo } from '@/consts/spotify';

const SpecificDialogue = () => (
	<AdderMain>
		<ToolHeading className='text-center'>
			Add <span className='text-myteal'>Specific</span> Playlists
		</ToolHeading>
		<SpecificAdder />
		<SpecificList />
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

export default SpecificDialogue;

export const metadata = {
	title: 'Add Specific Playlists',
	description: 'Add specific playlists / albums locally to the tool from here',
};

export const dynamic = 'force-static';
