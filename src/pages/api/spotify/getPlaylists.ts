import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@lib/auth/options';
import { routeKeyRetriever } from '@lib/auth/accessKey';

import type {
	SpotifyUserPlaylistsResponse,
	MySpotifyPlaylistResponse
} from '@lib/types/spotify';

// The assumption for this route is that every sign-on refreshes access token
// Session never updates, and only exists until access token expiry

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const session = await getServerSession(req, res, authOptions);
	// If no session, send 403 and redirect client-side
	if (!session) return res.status(403).json({ error: 'Unauthorized' });

	// Access token should never expire if there is a session
	let token = null;
	try {
		token = await routeKeyRetriever(session.user.id);
	} catch {
		return res.status(501).json({ error: 'Network error' });
	};
	// No token means that token somehow expired => client-side redirect
	if (token === null) return res.status(403).json({ error: 'Unauthorized' });
	console.log(token);
	try {
		const headers = new Headers()
		headers.append('Authorization', `Bearer ${token}`)
		const rawSpotify = await fetch(
			'https://api.spotify.com/v1/me/playlists',
			{
				headers: headers
			})
		if (rawSpotify.ok === false) {
			const jsoned = await rawSpotify.json();
			console.log(jsoned)
			throw new Error;
		}
		const jsoned = await rawSpotify.json();
		const items: SpotifyUserPlaylistsResponse[] = jsoned.items;
		const returnItems = items.map(item => {
			const { id, images, name, owner, tracks, href } = item;
			const returner: MySpotifyPlaylistResponse = {
				id, image: images[0], name, owner, tracks, href
			};
			console.log(returner);
			return returner;
		});
		return res.status(200).json(returnItems);
	} catch {
		return res.status(501).json({ error: 'There was a spotify error' })
	};
};
