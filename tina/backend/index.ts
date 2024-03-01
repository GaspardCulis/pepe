import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";

import { gql } from "./gql";

new Elysia().use(cors()).post("/api/gql", gql).listen(3000);
