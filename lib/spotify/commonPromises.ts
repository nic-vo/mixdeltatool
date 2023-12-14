import { TimeoutError } from './errors'

export async function localTimeout<D>(
	globalTimeoutMS: number,
	localLimit: number
): Promise<D> {
	return new Promise(async (_, rej) => {
		await new Promise(async r => setTimeout(() => r, Date.now() - globalTimeoutMS - localLimit));
		return rej(new TimeoutError());
	})
};
