import mongoosePromise, { Account } from '@/lib/database/mongoose';
import type { Account as AccountType } from 'next-auth';

export const signInUpdater = async (account: AccountType) => {
	// Update existing access_key
	// This should only run if app has existing provider account
	// + should ALWAYS run because I think next-auth abstracts away
	// 'Account' document creation and linking to a user even on first sign-in

	// This shouldn't happen because next-auth should always hit
	// The Spotify OAuth endpoint
	const { access_token, expires_at, refresh_token, providerAccountId } =
		account;
	if (!access_token || !expires_at || !refresh_token) throw new Error();
	await mongoosePromise();
	// Use findOneAndUpdate because hopefully it's atomic on MongoDB's side
	await Account.findOneAndUpdate(
		{
			providerAccountId,
			provider: 'spotify',
		},
		{
			access_token,
			expires_at,
			refresh_token,
		}
	).exec();
	// The only errors should be at network level hopefully;
	// Assumes Account model is correct
	// + next-auth adapters don't change their schema suddenly
	return;
};

export const routeKeyRetriever = async (id: string) => {
	// This function assumes that my signIn callback works
	// on every signIn, refreshing the user's access token in the 'Account'
	await mongoosePromise();
	const query = await Account.findOne({ userId: id })
		.where('provider')
		.equals('spotify')
		.select(['access_token', 'expires_at'])
		.exec();
	// Should never equal null, assuming next-auth
	// Does all its abstract stuff
	if (query !== null)
		return {
			accessToken: query.access_token,
			expiresAt: query.expires_at,
		};

	// The only errors should be at network level hopefully;
	// Assumes Account model is correct
	// + next-auth adapters don't change their schema suddenly

	return null;
};
