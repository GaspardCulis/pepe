export const prerender = false;

import type { APIRoute } from "astro";
import { databaseRequest } from "../../../../lib/databaseConnection";
import { createRemoteJWKSet, jwtVerify } from "jose";

const jwks = createRemoteJWKSet(new URL("https://auth.gasdev.fr/oidc/jwks"));

export const ALL: APIRoute = async ({ request }) => {
	const authorization = request.headers.get("authorization");

	if (!authorization) {
		return new Response("Authorization header missing", {
			status: 500,
		});
	}

	if (!authorization.startsWith("Bearer ")) {
		return new Response(
			"Authorization header is not in the Bearer scheme",
			{
				status: 501,
			},
		);
	}

	const token = authorization.slice(7);

	const { payload } = await jwtVerify(token, jwks, {
		issuer: "https://auth.gasdev.fr/oidc",
		audience: "https://danielculis.fr/api/tina/gql",
	});
	const scope = payload.scope as string;

	if (!scope.split(" ").includes("write:pepe-tina-graphql")) {
		return new Response(JSON.stringify({ status: "Unautorized" }), {
			status: 403,
		});
	}

	const { query, variables } = await request.json();

	return new Response(
		JSON.stringify(await databaseRequest({ query, variables })),
	);
};
