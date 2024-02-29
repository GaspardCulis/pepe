import { isAuthorized } from "../../lib/utils";
import { databaseRequest } from "../../lib/databaseConnection";
import { CORS_HEADERS } from ".";

export const gql_ALL: Route = async (request) => {
	const authorized = await isAuthorized(
		request.headers,
		"https://danielculis.fr/api",
		["write:graphql"],
	).catch((e) => {
		console.error(e);
		return false;
	});

	if (!authorized && false) {
		return new Response(JSON.stringify({ status: "Unautorized" }), {
			status: 403,
			...CORS_HEADERS,
		});
	}

	const json = await request.json().catch((_e) => null);
	if (json === null) {
		return new Response(JSON.stringify({ status: "Invalid JSON" }), {
			status: 502,
			...CORS_HEADERS,
		});
	}

	const { query, variables } = json;

	return new Response(
		JSON.stringify(await databaseRequest({ query, variables })),
		CORS_HEADERS,
	);
};
