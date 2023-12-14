import type { NextAuthOptions } from 'next-auth';

import SpotifyProvider from 'next-auth/providers/spotify';
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import clientPromise from '@lib/database/client';
import { signInUpdater } from './accessKey';
import { SPOT_LOGIN_WINDOW } from '@consts/spotify';

const SPOTIFY_SCOPES = [
	'user-read-email',
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
		maxAge: SPOT_LOGIN_WINDOW
	},
	adapter: MongoDBAdapter(clientPromise, {
		databaseName: process.env.MONGODB_DB_NAME
	}),
	callbacks: {
		async signIn({ account }) {
			// In this case, account param refers to
			// New account info returned from Spotify upon successful auth from them
			if (account === null || account === undefined) return '/retrylogin';
			// This should return regardless of whether next-auth account exists
			// Otherwise it's standard next-auth behavior
			try {
				await signInUpdater(account);
			}
			catch {
				return '/retrylogin';
			};
			return true;
		},
		async session({ session, user }) {
			session.user = { ...user };
			// The following is an attempt to keep session
			// At the same expiry as OAuth provider access key expiry
			// But I think the session update, specifically cookie manipulation,
			// Doesn't take into account changes to session token 'expires' here

			// try {
			// 	const expiry = await enforceSignInExpiry(user.id);
			// 	if (expiry !== null) {
			// 		const dater = new Date();
			// 		dater.setMilliseconds(expiry)
			// 		session.expires = dater.toISOString();
			// 	}
			// } catch {

			// }
			return session;
		}
	},
	debug: process.env.NODE_ENV !== 'production'
};
