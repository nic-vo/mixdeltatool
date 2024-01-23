import mongoosePromise, { Account } from '@lib/database/mongoose';
import type { Account as AccountType } from 'next-auth';

export const signInUpdater = async (account: AccountType) => {
	// Update existing access_key
	// This should only run if app has existing provider account
	try {
		await mongoosePromise();
		const updateAccount = await Account.findOne(
			{ providerAccountId: account.providerAccountId })
			.where('provider')
			.equals('spotify')
			.exec();
		if (updateAccount !== undefined && updateAccount !== null) {
			updateAccount.access_token = account.access_token;
			updateAccount.expires_at = account.expires_at;
			await updateAccount.save();
		}
	} catch {
		// The only errors should be at network level hopefully;
		// Assumes Account model is correct
		// + next-auth adapters don't change their schema suddenly
		throw 'Network error'
	}
	return null;
}

export const routeKeyRetriever = async (id: string) => {
	// This function assumes that my signin callback works
	// And that on every signin,
	// next-auth refreshes the user access token in the Account collection
	let token = null;
	try {
		await mongoosePromise();
		const query = await Account.findOne({ userId: id })
			.where('provider')
			.equals('spotify')
			.select(['access_token', 'expires_at'])
			.exec();
		if (query !== null) token = {
			accessToken: query.access_token,
			expiresAt: query.expires_at
		};
	} catch {
		// The only errors should be at network level hopefully;
		// Assumes Account model is correct
		// + next-auth adapters don't change their schema suddenly
		throw 'Network error'
	}
	return token;
}
