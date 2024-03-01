import { createRemoteJWKSet, jwtVerify } from "jose";

export function auth(config: {
	remote_url: string;
	issuer_url: string;
	audience: string;
	scopes: string[];
}) {
	const jwks = createRemoteJWKSet(new URL(config.remote_url));
	return async ({
		request,
	}: {
		request: Request;
	}): Promise<Response | undefined> => {
		const authorization = request.headers.get("Authorization");

		if (!authorization) {
			return new Response("Missing Authorization header", {
				status: 400,
			});
		}

		if (!authorization.startsWith("Bearer ")) {
			return new Response(
				"Authorization header not following the Bearer scheme",
				{ status: 400 },
			);
		}

		const token = authorization.slice(7);

		const { payload } = await jwtVerify(token, jwks, {
			issuer: config.issuer_url,
			audience: config.audience,
		}).catch((_e) => {
			return {
				payload: null,
			};
		});

		if (!payload) {
			return new Response("Missing JWT payload", { status: 400 });
		}

		const scope = payload.scope as string;

		let valid_scopes = true;
		const remote_scopes = scope.split(" ");
		for (const s of config.scopes) {
			valid_scopes = valid_scopes && remote_scopes.includes(s);
		}

		return valid_scopes
			? undefined
			: new Response("Invalid access scope", { status: 400 });
	};
}
