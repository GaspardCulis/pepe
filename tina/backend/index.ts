import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";

import { auth } from "./middleware/auth";

import * as gql from "./routes/gql";
import * as media from "./routes/media";
import * as pushcallback from "./routes/pushcallback";

const authConfig = {
	remote_url: "https://auth.gasdev.fr/oidc/jwks",
	issuer_url: "https://auth.gasdev.fr/oidc",
	audience: "https://danielculis.fr/api",
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

console.log(`🦊 Elysia is running at ${app.server?.url}`);
