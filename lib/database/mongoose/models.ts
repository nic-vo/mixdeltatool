import mongoose, { Schema, model, SchemaTypes } from 'mongoose';

const userSchema = new Schema({
	_id: {
		type: SchemaTypes.ObjectId,
		required: true
	},
	name: SchemaTypes.String,
	email: SchemaTypes.String,
	image: SchemaTypes.String,
	emailVerified: SchemaTypes.Date,
});
const UserModel = model('user',
	userSchema,
	'users',
	{ overwriteModels: true }
);
export const User = (mongoose.models['user'] as typeof UserModel) || UserModel;

const sessionSchema = new Schema({
	sessionToken: {
		type: SchemaTypes.String,
		required: true
	},
	expires: {
		type: SchemaTypes.Date,
		required: true
	},
	userId: {
		type: SchemaTypes.ObjectId,
		required: true,
		ref: 'user'
	}
});
const SessionModel = model('session',
	sessionSchema,
	'sessions',
	{ overwriteModels: true }
);
export const Session = (mongoose.models['session'] as typeof SessionModel) || SessionModel;

const accountSchema = new Schema({
	provider: {
		type: SchemaTypes.String,
		required: true
	},
	type: {
		type: SchemaTypes.String,
		required: true
	},
	providerAccountId: {
		type: SchemaTypes.String,
		required: true
	},
	access_token: {
		type: SchemaTypes.String,
		required: true
	},
	token_type: {
		type: SchemaTypes.String,
		required: true
	},
	expires_at: {
		type: SchemaTypes.Number,
		required: true
	},
	refresh_token: {
		type: SchemaTypes.String,
		required: true
	},
	scope: SchemaTypes.String,
	userId: {
		type: SchemaTypes.ObjectId,
		required: true,
		ref: 'user'
	}
});
const AccountModel = model('account',
	accountSchema,
	'accounts',
	{ overwriteModels: true }
);
export const Account = (mongoose.models['account'] as typeof AccountModel) || AccountModel;

const globalStatusPointerSchema = new Schema({
	current: {
		type: SchemaTypes.ObjectId,
		required: true,
		ref: 'globalStatus'
	}
});
const GlobalStatusPointerModel = model('globalStatusPointer',
	globalStatusPointerSchema,
	'globalStatusPointers',
	{ overwriteModels: true }
);
export const GlobalStatusPointer = (mongoose.models['globalStatusPointer'] as typeof GlobalStatusPointerModel) || GlobalStatusPointerModel;

const globalStatusSchema = new Schema({
	active: {
		type: SchemaTypes.Number,
		required: true
	},
	status: {
		type: SchemaTypes.String,
		required: true
	},
	statusType: {
		type: SchemaTypes.String,
		required: true
	}
});
const GlobalStatusModel = model('globalStatus',
	globalStatusSchema,
	'globalStatuses',
	{ overwriteModels: true }
);
export const GlobalStatus = (mongoose.models['globalStatus'] as typeof GlobalStatusModel) || GlobalStatusModel;

const contactMessageSchema = new Schema({
	ip: {
		type: SchemaTypes.String,
		required: true
	},
	name: {
		type: SchemaTypes.String,
		required: true
	},
	message: {
		type: SchemaTypes.String,
		required: true
	},
});
const ContactMessageModel = model('contactMessage',
	contactMessageSchema,
	'contactMessages',
	{ overwriteModels: true }
);
export const ContactMessage = (mongoose.models['contactMessage'] as typeof ContactMessageModel) || ContactMessageModel;
