import NextAuth, { Account, User } from 'next-auth';
import Spotify from 'next-auth/providers/spotify';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import clientPromise from './mongocfg';
import { signInUpdater } from './accessKey';
import { SPOT_LOGIN_WINDOW } from '@/consts/spotify';

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
	session: {
		strategy: 'database',
		maxAge: SPOT_LOGIN_WINDOW,
	},
	callbacks: {
		async signIn({
			account,
		}: {
			user:
				| User
				| (User & { id: string; eamil: string; emailVerified: Date | null });
			account: Account | null;
		}): Promise<boolean | string> {
			if (!account) return '/';
			try {
				await signInUpdater(account);
			} catch {
				return '/';
			}
			return true;
		},
	},
	debug: process.env.NODE_ENV !== 'production',
});
