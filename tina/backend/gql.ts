import { isAuthorized } from "../../lib/utils";
import { databaseRequest } from "../../lib/databaseConnection";

export const gql_ALL: Route = async (request) => {
	const authorized = await isAuthorized(
		request.headers,
		"https://danielculis.fr/api",
		["write:graphql"],
	).catch((e) => {
		console.error(e);
		return false;
	});

	if (!authorized) {
		return new Response(JSON.stringify({ status: "Unautorized" }), {
			status: 403,
		});
	}

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
