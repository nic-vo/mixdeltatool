'use client';

import ListItem from '../../_components/ListItem';
import { useSelector } from 'react-redux';
import { selectUserPlaylists } from '@/state';
import { useEffect, useState } from 'react';
import { ListContainer, ListUL } from '../../_components/server';

export default function UserList() {
	const [first, setFirst] = useState(true);
	const playlists = useSelector(selectUserPlaylists);

	// Bypass hydration warning
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
							className='grow-0 shrink w-full sm:w-auto'>
							<ListItem playlist={playlist} />
						</li>
					))}
				</ListUL>
			)}
		</ListContainer>
	);
}
