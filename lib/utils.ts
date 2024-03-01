import LogtoClient from "@logto/browser";

export function createLogToClient(): LogtoClient {
	return new LogtoClient({
		endpoint: "https://auth.gasdev.fr/",
		appId: "irxbfn6981qpl0oxuiqqu",
		resources: ["https://danielculis.fr/api"],
		scopes: ["write:graphql", "read:media", "write:media"],
	});
}
