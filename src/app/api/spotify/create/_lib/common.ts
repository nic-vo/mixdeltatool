import { badResponse } from '@/lib/route_helpers/responses';

export const myRace = async (racer: Promise<Response>, timeoutMS: number) =>
	await Promise.race([
		racer,
		(async () => {
			await new Promise((r) => setTimeout(() => r, timeoutMS));
			return badResponse(504);
		})(),
	]);

export async function concurrentThrowNotReturn(softReturn: Promise<Response>) {
	const response = await softReturn;
	if (!response.ok) throw response;
	return response;
}
