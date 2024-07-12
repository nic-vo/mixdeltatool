import ImageLoader from '@/components/global/ImageLoader';
import { IoExitOutline } from 'react-icons/io5';
import { InlineLink } from '@/components/global/serverComponentUI';
import Image from 'next/image';
import { MixDeltaLogo } from '@/consts/spotify';

import { MyPlaylistObject } from '@/lib/validators';

const ListItem = ({
	playlist: { name, owner, tracks, image, id, type },
}: {
	playlist: MyPlaylistObject;
}) => (
	<section className='grid grid-cols-3 items-center gap-4 p-4 bg-neutral-800 focus-within:bg-neutral-600 transition-all max-w-md overflow-hidden'>
		<h3 className='relative w-max max-w-full col-start-2 col-span-full text-xl leading-none block font-black font-cabin'>
			<InlineLink
				href={`https://open.spotify.com/playlist/${id}`}
				target='_blank'
				className='no-underline focus-visible:outline-none focus-visible:underline hover:underline focus-visible:text-myteal hover:text-myteal block transition-colors'
				aria-label={`Check out ${name} on Spotify`}>
				<span
					className='block whitespace-nowrap text-ellipsis max-w-full overflow-x-hidden py-1'
					aria-hidden
					tabIndex={-1}>
					{name}
				</span>
			</InlineLink>
		</h3>
		<div className='flex items-center aspect-square size-auto max-h-32 col-start-1 col-span-1 row-start-1 row-span-3 justify-self-center sm:self-center overflow-hidden'>
			{image ? (
				<ImageLoader
					url={image.url}
					alt={`${name}'s album art`}
				/>
			) : (
				<Image
					src={MixDeltaLogo}
					alt={`Album art placeholder`}
					className='transition-all h-full w-auto'
				/>
			)}
		</div>
		<ul className='col-start-2 col-span-full font-thin text-zinc-400'>
			<li>
				<span>
					{type} - {tracks} tracks
				</span>
			</li>
			<li>
				<ul className='flex divide-x border-white flex-wrap'>
					{owner.map(({ name, id }) => (
						<li
							key={id}
							className='inline-block px-2 first:pl-0'>
							<InlineLink
								href={`https://open.spotify.com/user/${id}`}
								target='_blank'
								className='font-normal hover:text-white focus-visible:text-white transition-all'
								aria-label={`Check out ${name ?? id} on Spotify`}>
								<span aria-hidden>{name ?? id}</span>
								<IoExitOutline
									aria-hidden
									className='inline-block ml-1'
								/>
							</InlineLink>
						</li>
					))}
				</ul>
			</li>
		</ul>
	</section>
);

export default ListItem;
