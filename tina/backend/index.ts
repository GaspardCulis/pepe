import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";

import * as gql from "./gql";
import * as media from "./media";

new Elysia()
	.use(cors({ methods: "*" }))
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
