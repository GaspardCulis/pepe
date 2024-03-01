import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";

import { auth } from "./middleware/auth";

import * as gql from "./routes/gql";
import * as media from "./routes/media";
import * as pushcallback from "./routes/pushcallback";

const authConfig = {
	remote_url: import.meta.env.AUTH_REMOTE_URL,
	issuer_url: import.meta.env.AUTH_ISSUER_URL,
	audience: import.meta.env.AUTH_API_AUDIENCE,
};

const app = new Elysia()
	.use(cors({ methods: "*" }))
	.group("/api", (app) =>
		app
			.post("/pushcallback", pushcallback.POST)
			.post("/gql", gql.POST, {
				beforeHandle: auth({
					...authConfig,
					scopes: ["write:graphql"],
				}),
			})
			.group("/media", (app) =>
				app
					.get("", media.GET, {
						beforeHandle: auth({
							...authConfig,
							scopes: ["read:media"],
						}),
					})
					.post("", media.POST, {
						beforeHandle: auth({
							...authConfig,
							scopes: ["write:media"],
						}),
					})
					.delete("", media.DELETE, {
						beforeHandle: auth({
							...authConfig,
							scopes: ["write:media"],
						}),
					}),
			),
	)
	.listen(3000);

console.log(`🦊🦙 Elysia Tina backend is running at ${app.server?.url}`);
