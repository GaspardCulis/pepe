import { gql_ALL } from "./gql";

export const CORS_HEADERS = {
	headers: {
		"Access-Control-Allow-Origin": "*",
		"Access-Control-Allow-Methods": "OPTIONS, GET, POST",
		"Access-Control-Allow-Headers": "Content-Type, Authorization",
	},
};
const server = Bun.serve({
	async fetch(req) {
		if (req.method === "OPTIONS") {
			return new Response("Departed", CORS_HEADERS);
		}

		const path = new URL(req.url).pathname;
		switch (path) {
			case "/":
				return new Response("Hello!");
			case "/api/gql":
				return gql_ALL(req);
			default:
				return new Response("Page not found", { status: 404 });
		}
	},
});

console.log(`Listening on ${server.url}`);
