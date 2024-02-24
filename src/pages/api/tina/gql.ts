export const prerender = false;

import type { APIRoute } from "astro";
import { databaseRequest } from "../../../../lib/databaseConnection";

export const ALL: APIRoute = async ({ request }) => {
	const { query, variables } = await request.json();

	return new Response(
		JSON.stringify(await databaseRequest({ query, variables })),
	);
};
