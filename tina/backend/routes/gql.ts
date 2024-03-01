import { databaseRequest } from "../../../lib/databaseConnection";
import type { Handler } from "elysia";

export const POST: Handler = async ({ request }) => {
	const json = await request.json().catch((_e) => null);
	if (json === null) {
		return new Response(JSON.stringify({ status: "Invalid JSON" }), {
			status: 502,
		});
	}

	const { query, variables } = json;

	return new Response(
		JSON.stringify(await databaseRequest({ query, variables })),
	);
};
