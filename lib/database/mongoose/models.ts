import { ObjectId } from 'mongodb';
import mongoose, { Schema, model } from 'mongoose';

const userSchema = new Schema({
	name: String,
	email: String,
	image: String,
	emailVerified: Number
});
const UserModel = model('user',
	userSchema,
	'users',
	{ overwriteModels: true }
);
export const User = (mongoose.models['user'] as typeof UserModel) || UserModel;

const sessionSchema = new Schema({
	sessionToken: String,
	expires: Date,
	userId: ObjectId
});

const SessionModel = model('session',
	sessionSchema,
	'sessions',
	{ overwriteModels: true }
);
export const Session = (mongoose.models['session'] as typeof SessionModel) || SessionModel;

const accountSchema = new Schema({
	provider: String,
	providerAccountId: String,
	type: String,
	access_token: String,
	token_type: String,
	expires_at: Number,
	refresh_token: String,
	scope: String,
	userId: ObjectId
});

const AccountModel = model('account',
	accountSchema,
	'accounts',
	{ overwriteModels: true }
);
export const Account = (mongoose.models['account'] as typeof AccountModel) || AccountModel;
