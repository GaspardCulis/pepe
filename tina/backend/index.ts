import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";

import * as gql from "./gql";
import * as media from "./media";

new Elysia()
	.use(cors())
	.post("/api/gql", gql.POST)
	.get("/api/media", media.GET)
	.post("/api/media", media.POST)
	.delete("/api/media", media.DELETE)
	.listen(3000);
