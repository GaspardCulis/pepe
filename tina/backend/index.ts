import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { staticPlugin } from "@elysiajs/static";

import { auth } from "./middleware/auth";

import * as gql from "./routes/gql";
import * as media from "./routes/media";
import * as pushcallback from "./routes/pushcallback";

const authConfig = {
	remote_url: import.meta.env.AUTH_REMOTE_URL,
	issuer_url: import.meta.env.AUTH_ISSUER_URL,
	audience: import.meta.env.AUTH_API_AUDIENCE,
};

const siteUrl = "https://danielculis.fr";

const app = new Elysia()
	.use(cors({ methods: "*" }))
	.use(
		staticPlugin({
			assets: "tina/backend/admin",
			prefix: "/admin",
		}),
	)
	.get("/auth/callback", ({ set }) => {
		set.headers["Content-Type"] = "text/html; charset=utf8";
		return Bun.file("tina/backend/html/auth/callback.html");
	})
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
	.get("/*", async ({ request }) => {
		const requestUrl = new URL(request.url);
		const redirectUrl = new URL(requestUrl.pathname, siteUrl);

		request.headers.set("host", new URL(siteUrl).host);

		const siteResponse = await fetch(redirectUrl, {
			headers: request.headers,
		});

		const responseHeaders = new Headers(siteResponse.headers);
		responseHeaders.delete("content-encoding");

		const responseBuffer = await siteResponse.arrayBuffer();

		return new Response(responseBuffer, {
			status: siteResponse.status,
			headers: responseHeaders,
		});
	})
	.listen(3000);

console.log(`🦊🦙 Elysia Tina backend is running at ${app.server?.url}`);
