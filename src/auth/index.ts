import NextAuth from 'next-auth';
import Spotify from 'next-auth/providers/spotify';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import clientPromise from './mongocfg';
import { signInUpdater } from './accessKey';
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

const maxAgeSeconds = 60 * 60 * 24 * 3;

const { handlers, signIn, signOut, auth } = NextAuth({
	basePath,
	providers: [Spotify(config)],
	adapter: MongoDBAdapter(clientPromise, {
		databaseName: process.env.MONGODB_DB_NAME,
	}),
	session: {
		strategy: 'database',
		maxAge: maxAgeSeconds,
		updateAge: 60 * 60 + 1,
	},
	callbacks: {
		async signIn({ account }): Promise<boolean | string> {
			if (!account) return '/';
			try {
				// VERIFIED BEHAVIOR next-auth@5.0.0beta0.19
				// next-auth still does not update access or refresh tokens upon sign-in
				await signInUpdater(account);
			} catch {
				return '/';
			}
			return true;
		},
		async session({ session, user }) {
			if (!process.env.SPOTIFY_ID) throw new Error('Missing Spotify ID');
			session.user.email = user.email;
			session.user.name = user.name;
			// Return early if now is still within 1 hour of signing in
			if (
				Date.parse(session.expires) - 1000 * (maxAgeSeconds - (60 * 60 + 5)) >
				Date.now()
			)
				return session;

			/*
			**Refresh account access token, expiry, and refresh token
			if an hour has passed since login;
			This is kind of a race condition against the session updateAge
			i.e. auth is handling session refresh in a separate db transaction
			Access token refresh might retrigger multiple times
			if window is too small between
			session refresh thresholdand access token threshold
			Different Date.now()
			*/

			// Find account based on ID
			const db = await mongoosePromise();
			if (!db) throw new Error();
			const mongooseSession = await db.startSession();
			mongooseSession.startTransaction();
			try {
				const account = await Account.findOne({ userId: user.id }, null, {
					session: mongooseSession,
				}).exec();
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
				await account.save({ session: mongooseSession });
				await mongooseSession.commitTransaction();
			} catch {
				await mongooseSession.abortTransaction();
				await mongooseSession.endSession();
				throw new Error();
			}
			await mongooseSession.endSession();
			return session;
		},
	},
	pages: {
		signIn: '/login',
	},
	debug: process.env.NODE_ENV !== 'production',
});

async function saSignIn() {
	'use server';
	await signIn('spotify', { redirectTo: '/tool' });
}

async function saSignOut() {
	'use server';
	await signOut({ redirectTo: '/' });
}

export { handlers, auth, signIn, signOut, saSignIn, saSignOut };
