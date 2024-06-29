import NextAuth, { Account as AccountType } from 'next-auth';
import Spotify from 'next-auth/providers/spotify';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import clientPromise from './mongocfg';
import { signInUpdater } from './accessKey';
import { SPOT_LOGIN_WINDOW } from '@/consts/spotify';
import mongoosePromise from '@/lib/database/mongoose/connection';
import { Account } from '@/lib/database/mongoose/models';

if (!process.env.SPOTIFY_SECRET || !process.env.SPOTIFY_ID)
	throw new Error('Missing Spotify creds');

const SPOT_BASE_URL = 'https://accounts.spotify.com';

const SPOTIFY_SCOPES = [
	'user-read-email',
	// 'user-library-read',
	'playlist-read-private',
	'playlist-read-collaborative',
	'playlist-modify-public',
	'playlist-modify-private',
	'ugc-image-upload',
];
const nParams = new URLSearchParams();
nParams.append('scope', SPOTIFY_SCOPES.join(' '));
const SPOT_URL = `${SPOT_BASE_URL}/authorize?${nParams.toString()}`;

const config = {
	clientId: process.env.SPOTIFY_ID,
	clientSecret: process.env.SPOTIFY_SECRET,
	authorization: SPOT_URL,
};

export const basePath = '/api/auth';

const { handlers, signIn, signOut, auth } = NextAuth({
	basePath,
	providers: [Spotify(config)],
	adapter: MongoDBAdapter(clientPromise, {
		databaseName: process.env.MONGODB_DB_NAME,
	}),
	session: {
		strategy: 'database',
		maxAge: SPOT_LOGIN_WINDOW,
		updateAge: SPOT_LOGIN_WINDOW + 2 * 60,
		// specify updateAge greater than maxAge to update session and accessToken manually
	},
	callbacks: {
		async signIn(args): Promise<boolean | string> {
			if (!args.account) return '/';
			try {
				await signInUpdater(args.account);
			} catch {
				return '/';
			}
			return true;
		},
		async session(args) {
			let { session } = args;
			if (!process.env.SPOTIFY_ID) throw new Error('Missing Spotify ID');
			// Return early if expiry is more than two minutes away
			if (new Date(session.expires).getTime() - Date.now() > 2 * 60 * 1000)
				return session;

			try {
				// Find account based on ID
				await mongoosePromise();
				const account = await Account.findOne({ userId: args.user.id }).exec();
				if (!account) throw new Error();
				// Take refresh token and post to spotify token refresh URL
				const response = await fetch(`${SPOT_BASE_URL}/api/token`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
					body: new URLSearchParams({
						grant_type: 'refresh_token',
						refresh_token: account.refresh_token,
						client_id: process.env.SPOTIFY_ID,
					}),
				});
				if (!response.ok) throw new Error();
				const { access_token, expires_in, refresh_token } =
					(await response.json()) as {
						access_token: string;
						expires_in: number;
						refresh_token: string;
					};
				// Update account document with new access_token, refresh_token, and expires_at
				account.access_token = access_token;
				account.refresh_token = refresh_token;
				account.expires_at = Math.floor(Date.now() / 1000) + expires_in;
				await account.save();
			} catch {
				return session;
			}
			session.user = { ...user };
			return session;
		},
	},
	debug: process.env.NODE_ENV !== 'production',
});

async function saSignIn() {
	'use server';
	await signIn();
}

async function saSignOut() {
	'use server';
	await signOut();
}

export { handlers, auth, signIn, signOut, saSignIn, saSignOut };
