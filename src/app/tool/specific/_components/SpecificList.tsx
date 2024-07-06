'use client';

import { useSelector } from 'react-redux';
import { selectSpecificPlaylists } from '@/state';
import ListItem from '../../_components/dynamic/ListItem';
import { useEffect, useState } from 'react';
import { InlineLink } from '@/components/global/serverComponentUI';
import Image from 'next/image';
import { SpotifyLogo } from '@/consts/spotify';

export default function SpecificList() {
	const [first, setFirst] = useState(true);
	const playlists = useSelector(selectSpecificPlaylists);

	useEffect(() => setFirst(false), []);

	return (
		<section className='flex flex-col items-center gap-8 flex-shrink overflow-hidden w-full'>
			<hgroup className='flex flex-col gap-8 items-center'>
				<h2 className='font-light text-3xl text-center w-max'>
					Stored Playlists
				</h2>
				<p className='flex items-center gap-2 flex-wrap justify-center'>
					<span className='block relative'>
						All playlist data is provided by{' '}
					</span>
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
			</hgroup>
			{first || playlists.length === 0 ? (
				<p className='text-slate-600'>Nothing here...</p>
			) : (
				<ul
					className='flex w-full justify-center flex-wrap gap-8 h-full overflow-auto outline-white focus-visible:outline -outline-offset-2 p-2 rounded-xl'
					tabIndex={0}>
					{playlists.map((playlist) => (
						<li
							key={playlist.id}
							className='grow-0 shrink w-full sm:w-auto'>
							<ListItem playlist={playlist} />
						</li>
					))}
				</ul>
			)}
		</section>
	);
}
