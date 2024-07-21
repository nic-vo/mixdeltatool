import { Schema, model } from 'mongoose';

const userSchema = new Schema({
	// Populated by Spotify() provider profile() call
	_id: {
		type: Schema.Types.ObjectId,
		required: true,
	},
	name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
	},
	image: {
		type: String,
		required: true,
	},
	emailVerified: {
		type: String,
		required: true,
		default: null,
	},
});
export const User = model('user', userSchema, 'users', {
	overwriteModels: true,
});

const sessionSchema = new Schema({
	sessionToken: {
		type: String,
		required: true,
	},
	expires: {
		type: Date,
		required: true,
	},
	userId: {
		type: Schema.Types.ObjectId,
		required: true,
		ref: 'user',
	},
});
export const Session = model('session', sessionSchema, 'sessions', {
	overwriteModels: true,
});

const accountSchema = new Schema({
	provider: {
		type: String,
		enum: ['spotify'],
		required: true,
	},
	type: {
		type: String,
		enum: ['oauth'],
		required: true,
	},
	providerAccountId: {
		type: String,
		required: true,
	},
	access_token: {
		type: String,
		required: true,
	},
	token_type: {
		type: String,
		required: true,
	},
	expires_at: {
		type: Number,
		required: true,
	}, // Equivalent to Math.floor(Date.now() / 1000) to get seconds
	refresh_token: {
		type: String,
		required: true,
	},
	scope: {
		type: String,
		required: true,
	},
	userId: {
		type: Schema.Types.ObjectId,
		required: true,
		ref: 'user',
	},
});
export const Account = model('account', accountSchema, 'accounts', {
	overwriteModels: true,
});

const globalStatusPointerSchema = new Schema({
	current: {
		type: Schema.Types.ObjectId,
		required: true,
		ref: 'globalStatus',
	},
});
export const GlobalStatusPointer = model(
	'globalStatusPointer',
	globalStatusPointerSchema,
	'globalStatusPointers',
	{ overwriteModels: true }
);

const globalStatusSchema = new Schema({
	active: {
		type: Number,
		required: true,
	},
	status: {
		type: String,
		required: true,
	},
	statusType: {
		type: String,
		enum: ['ok', 'severe', 'concern'],
		required: true,
	},
});
export const GlobalStatus = model(
	'globalStatus',
	globalStatusSchema,
	'globalStatuses',
	{ overwriteModels: true }
);

const contactMessageSchema = new Schema({
	ip: {
		type: String,
		required: true,
	},
	name: {
		type: String,
		required: true,
	},
	message: {
		type: String,
		required: true,
	},
});
export const ContactMessage = model(
	'contactMessage',
	contactMessageSchema,
	'contactMessages',
	{ overwriteModels: true }
);
