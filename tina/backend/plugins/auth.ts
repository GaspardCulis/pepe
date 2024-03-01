import { Elysia } from "elysia";
import { createRemoteJWKSet, jwtVerify } from "jose";

export const auth = (config: { remote_url: string; issuer_url: string }) =>
	new Elysia({
		name: "auth",
		seed: {
			config,
		},
	}).derive(({ headers: { authorization } }) => ({
		get auth() {
			const jwks = createRemoteJWKSet(new URL(config.remote_url));
			return async (audience: string, scopes: string[]) => {
				if (!authorization?.startsWith("Bearer ")) {
					return false;
				}

				const token = authorization?.slice(7);

				const { payload } = await jwtVerify(token, jwks, {
					issuer: config.issuer_url,
					audience,
				}).catch((_e) => {
					return {
						payload: null,
					};
				});

				if (!payload) {
					return false;
				}

				const scope = payload.scope as string;

				let valid_scopes = true;
				const remote_scopes = scope.split(" ");
				for (const s of scopes) {
					valid_scopes = valid_scopes && remote_scopes.includes(s);
				}

				return valid_scopes;
			};
		},
	}));

export default auth;
