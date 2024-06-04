import { MongoDBAdapter } from '@auth/mongodb-adapter';
import NextAuth from 'next-auth';
import Spotify from 'next-auth/providers/spotify';
import clientPromise from './mongocfg';

if (!process.env.SPOTIFY_SECRET || !process.env.SPOTIFY_ID)
	throw new Error('Missing Spotify creds');

const SPOTIFY_SCOPES = [
	'user-read-email',
	'user-library-read',
	'playlist-read-private',
	'playlist-read-collaborative',
	'playlist-modify-public',
	'playlist-modify-private',
	'ugc-image-upload',
];
const nParams = new URLSearchParams();
nParams.append('scope', SPOTIFY_SCOPES.join(' '));
const SPOT_URL = `https://accounts.spotify.com/authorize?${nParams.toString()}`;

const config = {
	clientId: process.env.SPOTIFY_ID,
	clientSecret: process.env.SPOTIFY_SECRET,
	authorization: SPOT_URL,
};

export const { handlers, signIn, signOut, auth } = NextAuth({
	providers: [Spotify(config)],
	adapter: MongoDBAdapter(clientPromise, {
		databaseName: process.env.MONGODB_DB_NAME,
	}),
});
