import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";

import * as gql from "./gql";

new Elysia().use(cors()).post("/api/gql", gql.POST).listen(3000);
