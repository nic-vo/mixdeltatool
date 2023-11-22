export const SPOT_PLAYLIST_ITER_INT = 10;
export const SPOT_PLAYLIST_PAGE_LIMIT = 49;
export const SPOT_LOGIN_WINDOW = 50 * 60;
export const AUTH_WINDOW = 4000;
export const GLOBAL_EXECUTION_WINDOW = 9000;
export const CLIENT_DIFF_TYPES = {
	'adu': "Add what's different to the target",
	'odu': "Delete everything except what's unique to the differ",
	'otu': "Delete everything except what's unique to the target",
	'bu': 'Delete all similarities but keep all differences',
	'stu': "Keep only what's similar to the differ"
};

export const SERVER_DIFF_TYPES = {
	adu: (params: { target: { owner: string, name: string }, differ: { owner: string, name: string } }) => {
		const { target, differ } = params;
		return `Anything different in ${differ.owner}'s "${differ.name}" is added to ${target.owner}'s "${target.name}".`;
	},
	odu: (params: { target: { owner: string, name: string }, differ: { owner: string, name: string } }) => {
		const { target, differ } = params;
		return `All that remains of ${target.owner}'s ${target.name} is anything unique to ${differ.owner}'s "${differ.name}".`;
	},
	otu: (params: { target: { owner: string, name: string }, differ: { owner: string, name: string } }) => {
		const { target, differ } = params;
		return `All that remains is anything unique to ${target.owner}'s "${target.name}".`;
	},
	bu: (params: { target: { owner: string, name: string }, differ: { owner: string, name: string } }) => {
		const { target, differ } = params;
		return `Any similarities between ${target.owner}'s "${target.name}" and ${differ.owner}'s "${differ.name}" are gone; only their uniques remain.`;
	},
	stu: (params: { target: { owner: string, name: string }, differ: { owner: string, name: string } }) => {
		const { target, differ } = params;
		return `Only shared tracks between ${target.owner}'s "${target.name}" and ${differ.owner}'s "${differ.name}".`;
	}
};

export const SPOT_URL_BASE = 'https://api.spotify.com/v1/'
