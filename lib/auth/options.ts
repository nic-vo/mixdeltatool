import type { NextAuthOptions } from 'next-auth';

import SpotifyProvider from 'next-auth/providers/spotify';
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import clientPromise from '@lib/database/client';
import { signInUpdater } from './accessKey';

const SPOTIFY_SCOPES = [
	'user-read-email',
	'user-read-currently-playing',
	'user-read-recently-played',
	'user-top-read',
	'user-library-read',
	'playlist-read-private',
	'playlist-read-collaborative',
	'playlist-modify-public',
	'playlist-modify-private'
];
const nParams = new URLSearchParams();
nParams.append('scope', SPOTIFY_SCOPES.join(' '));
const SPOT_URL = `https://accounts.spotify.com/authorize?${nParams.toString()}`

export const authOptions: NextAuthOptions = {
	providers: [
		SpotifyProvider({
			clientId: process.env.SPOTIFY_ID!,
			clientSecret: process.env.SPOTIFY_SECRET!,
			authorization: SPOT_URL
		})
	],
	session: {
		strategy: 'database',
		maxAge: 60 * 50
	},
	adapter: MongoDBAdapter(clientPromise, {
		databaseName: process.env.MONGODB_DB_NAME
	}),
	callbacks: {
		async signIn({ account }) {
			// In this case, account param refers to
			// New account info returned from Spotify upon successful auth from them
			if (account === null || account === undefined) return false;
			// This should return regardless of whether next-auth account exists
			// Otherwise it's standard next-auth behavior
			await signInUpdater(account);
			return true;
		},
		async session({ session, user }) {
			session.user = { ...user };
			return session;
		}
	},
	debug: process.env.NODE_ENV !== 'production'
};
