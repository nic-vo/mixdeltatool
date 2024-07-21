'use client';

import { useSelector } from 'react-redux';
import { selectSpecificPlaylists, selectUserPlaylists } from '@/state';
import { useEffect, useState } from 'react';

export default function PlaylistOptions() {
	const [first, setFirst] = useState(true);
	const userPlaylists = useSelector(selectUserPlaylists);
	const specificPlaylists = useSelector(selectSpecificPlaylists);

	useEffect(() => setFirst(false), []);

	if (first)
		return (
			<option
				value=''
				className='text-black'>
				Choose one...
			</option>
		);
	return (
		<>
			<option
				value=''
				className='text-black'>
				Choose one...
			</option>
			{specificPlaylists.length > 0 && (
				<optgroup
					label='Specific Playlists'
					className='text-black bg-myteal'>
					{specificPlaylists.map((playlist) => {
						const { id, name, owner, tracks } = playlist;
						return (
							<option
								value={id}
								key={id}
								className='bg-lightteal'>
								{name} /{' '}
								{owner.map(
									(user, index) =>
										`${user.name}${index < owner.length - 1 ? ',' : ''}`
								)}{' '}
								/ {tracks} tracks
							</option>
						);
					})}
				</optgroup>
			)}
			{userPlaylists.length > 0 && (
				<optgroup
					label='Your Playlists'
					className='text-black bg-satorange'>
					{userPlaylists.map((playlist) => {
						const { id, name, owner, tracks } = playlist;
						return (
							<option
								value={id}
								key={id}
								className='bg-lightorange'>
								{name} /{' '}
								{owner.map(
									(user, index) =>
										`${user.name}${index < owner.length - 1 ? ',' : ''}`
								)}{' '}
								/ {tracks} tracks
							</option>
						);
					})}
				</optgroup>
			)}
		</>
	);
}
