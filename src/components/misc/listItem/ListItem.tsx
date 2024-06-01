import { MyPlaylistObject } from '@/components/spotify/types';
import ImageLoader from '../ImageLoader/ImageLoader';
import { SpotifyLogo } from '@/consts/spotify';
import { FaExternalLinkAlt } from 'react-icons/fa';

import local from './ListItem.module.scss';
import differLook from '../../spotify/dynamic/playlistDiffer/PlaylistDiffer.module.scss';

const ListItem = (props: { playlist?: MyPlaylistObject }) => {
	if (props.playlist === undefined)
		return (
			<div className={differLook.emptyItem}>
				<p>nothing here...</p>
			</div>
		);

	const { name, owner, tracks, image, id, type } = props.playlist;
	return (
		<div className={local.item}>
			<p className={local.name}>
				<a
					href={`https://open.spotify.com/playlist/${id}`}
					target='_blank'
					className={local.link}>
					{name} <FaExternalLinkAlt />
				</a>
			</p>
			<div className={local.thumb}>
				<ImageLoader
					url={image ? image.url : null}
					alt={`${name}'s album art`}
				/>
			</div>
			<div className={local.info}>
				<ul className={local.meta}>
					<li>
						{type} - {tracks} tracks
					</li>
					<li>
						{owner.map((person, index) => {
							const { name, id } = person;
							return (
								<a
									key={person.id}
									href={`https://open.spotify.com/user/${id}`}
									target='_blank'
									className={local.link}>
									{name} <FaExternalLinkAlt />
								</a>
							);
						})}
					</li>
				</ul>
				<img
					src={SpotifyLogo.src}
					alt='Spotify Logo'
					className={local.spotLogo}
				/>
			</div>
		</div>
	);
};

export default ListItem;
