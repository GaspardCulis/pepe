import LogtoClient from "@logto/browser";
import { createRemoteJWKSet, jwtVerify } from "jose";

export function createLogToClient(): LogtoClient {
	return new LogtoClient({
		endpoint: "https://auth.gasdev.fr/",
		appId: "irxbfn6981qpl0oxuiqqu",
		resources: ["https://danielculis.fr/api"],
		scopes: ["write:graphql", "read:media"],
	});
}

export function getBearerToken(headers: Headers): string {
	const authorization = headers.get("authorization");

	if (!authorization) {
		throw new Error("Authorization header missing");
	}

	if (!authorization.startsWith("Bearer ")) {
		throw new Error("Authorization header is not in the Bearer scheme");
	}

	return authorization.slice(7);
}

export async function isAuthorized(
	authorization: Headers | string,
	audience: string,
	scopes: string[],
): Promise<boolean> {
	const jwks = createRemoteJWKSet(
		new URL("https://auth.gasdev.fr/oidc/jwks"),
	);

	const token =
		authorization instanceof Headers
			? getBearerToken(authorization)
			: authorization;

	const { payload } = await jwtVerify(token, jwks, {
		issuer: "https://auth.gasdev.fr/oidc",
		audience,
	}).catch((_e) => {
		return {
			payload: null,
		};
	});

	if (!payload) {
		throw new Error("JWT verification failed");
	}

	const scope = payload.scope as string;

	let valid_scopes = true;
	const remote_scopes = scope.split(" ");
	for (const s of scopes) {
		valid_scopes = valid_scopes && remote_scopes.includes(s);
	}

	return valid_scopes;
}
