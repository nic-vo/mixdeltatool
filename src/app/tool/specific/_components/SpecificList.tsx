'use client';

import { useSelector } from 'react-redux';
import { selectSpecificPlaylists } from '@/state';
import ListItem from '../../_components/ListItem';
import { useEffect, useState } from 'react';
import { ListContainer, ListUL } from '../../_components/server';

export default function SpecificList() {
	const [first, setFirst] = useState(true);
	const playlists = useSelector(selectSpecificPlaylists);

	useEffect(() => setFirst(false), []);

	return (
		<ListContainer>
			<hgroup className='flex flex-col gap-8 items-center'>
				<h2 className='font-karla font-extralight text-3xl text-center w-max'>
					Stored Playlists
				</h2>
			</hgroup>
			{first || playlists.length === 0 ? (
				<p className='text-slate-600'>Nothing here...</p>
			) : (
				<ListUL tabIndex={0}>
					{playlists.map((playlist) => (
						<li
							key={playlist.id}
							className='w-auto'>
							<ListItem playlist={playlist} />
						</li>
					))}
				</ListUL>
			)}
		</ListContainer>
	);
}
