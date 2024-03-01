import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";

import { auth } from "./plugins/auth";

import * as gql from "./routes/gql";
import * as media from "./routes/media";

new Elysia()
	.use(cors({ methods: "*" }))
	.use(
		auth({
			remote_url: "https://auth.gasdev.fr/oidc/jwks",
			issuer_url: "https://auth.gasdev.fr/oidc",
		}),
	)
	.group("/api", (app) =>
		app
			.post("/gql", gql.POST)
			.group("/media", (app) =>
				app
					.get("", media.GET)
					.post("", media.POST)
					.delete("", media.DELETE),
			),
	)
	.listen(3000);
