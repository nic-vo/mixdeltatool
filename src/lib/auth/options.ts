import type { NextAuthOptions } from 'next-auth';

import SpotifyProvider from 'next-auth/providers/spotify';
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import clientPromise from '@lib/database/mongoose/client';
import { signInUpdater } from './accessKey';
import { SPOT_LOGIN_WINDOW } from '@consts/spotify';

const SPOTIFY_SCOPES = [
	'user-read-email',
	'user-library-read',
	'playlist-read-private',
	'playlist-read-collaborative',
	'playlist-modify-public',
	'playlist-modify-private',
	'ugc-image-upload'
];
const nParams = new URLSearchParams();
nParams.append('scope', SPOTIFY_SCOPES.join(' '));
const SPOT_URL = `https://accounts.spotify.com/authorize?${nParams.toString()}`

export const authOptions: NextAuthOptions = {
	providers: [
		SpotifyProvider({
			clientId: process.env.SPOTIFY_ID!,
			clientSecret: process.env.SPOTIFY_SECRET!,
			authorization: SPOT_URL,
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
			// ***CONTAINS NEW ACCESS_TOKEN***
			// console.log('Account info from Spot:', account);
			// console.log('Profile from spot? Or existing profile:', profile);
			// Ideally, I don't think this'll ever be null
			if (!account) return '/';
			try {
				await signInUpdater(account);
			}
			catch {
				return '/';
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
