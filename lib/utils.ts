import LogtoClient from "@logto/browser";

export function createLogToClient(): LogtoClient {
	return new LogtoClient({
		endpoint: "https://auth.gasdev.fr/",
		appId: "irxbfn6981qpl0oxuiqqu",
		resources: ["https://danielculis.fr/api/tina/gql"],
		scopes: ["write:pepe-tina-graphql"],
	});
}
