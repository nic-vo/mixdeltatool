import mongoose, { Schema, model, SchemaTypes } from 'mongoose';

const userSchema = new Schema({
	name: SchemaTypes.String,
	email: SchemaTypes.String,
	image: SchemaTypes.String,
	emailVerified: SchemaTypes.Number
});
const UserModel = model('user',
	userSchema,
	'users',
	{ overwriteModels: true }
);
export const User = (mongoose.models['user'] as typeof UserModel) || UserModel;

const sessionSchema = new Schema({
	sessionToken: SchemaTypes.String,
	expires: SchemaTypes.Date,
	userId: SchemaTypes.ObjectId
});
const SessionModel = model('session',
	sessionSchema,
	'sessions',
	{ overwriteModels: true }
);
export const Session = (mongoose.models['session'] as typeof SessionModel) || SessionModel;

const accountSchema = new Schema({
	provider: SchemaTypes.String,
	providerAccountId: SchemaTypes.String,
	type: SchemaTypes.String,
	access_token: SchemaTypes.String,
	token_type: SchemaTypes.String,
	expires_at: SchemaTypes.Number,
	refresh_token: SchemaTypes.String,
	scope: SchemaTypes.String,
	userId: SchemaTypes.ObjectId
});
const AccountModel = model('account',
	accountSchema,
	'accounts',
	{ overwriteModels: true }
);
export const Account = (mongoose.models['account'] as typeof AccountModel) || AccountModel;
