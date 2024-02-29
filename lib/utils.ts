import LogtoClient from "@logto/browser";
import { spawn } from "node:child_process";
import { createRemoteJWKSet, jwtVerify } from "jose";

export function createLogToClient(): LogtoClient {
	return new LogtoClient({
		endpoint: "https://auth.gasdev.fr/",
		appId: "irxbfn6981qpl0oxuiqqu",
		resources: ["https://danielculis.fr/api"],
		scopes: ["write:graphql", "read:media", "write:media"],
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

export async function handleGithubPush() {
	// Pull the latest changes
	const pullProcess = spawn("git", ["pull"]);
	pullProcess.stderr.on("data", (data) => {
		console.error(`handleGithubPush: pullProcess -> stderr: ${data}`);
	});

	try {
		const code: number = await new Promise((resolve, reject) => {
			pullProcess.once("close", resolve);
			pullProcess.once("error", reject);
		});
		if (code != 0) {
			throw new Error(
				`Pull process exited with non-zero error code: (${code})`,
			);
		}
	} catch (e) {
		return new Error(`Error: ${(e as Error).message}`);
	}

	// Rebuild project
	const buildProcess = spawn("bun", ["run", "build"]);
	buildProcess.stderr.on("data", (data) => {
		console.error(`handleGithubPush: buildProcess -> stderr: ${data}`);
	});

	try {
		const code: number = await new Promise((resolve, reject) => {
			buildProcess.once("close", resolve);
			buildProcess.once("error", reject);
		});
		if (code != 0) {
			return new Error(
				`Build process exited with non-zero error code: (${code})`,
			);
		}
	} catch (e) {
		return new Error(`Error: ${(e as Error).message}`);
	}
}
