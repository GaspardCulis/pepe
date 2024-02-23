import database from "../tina/database";
import { queries } from "../tina/__generated__/types";
import { resolve } from "@tinacms/datalayer";
import type { TinaClient } from "tinacms/dist/client";

type DatabaseRequestParams = {
	query: string;
	variables: Record<string, any> | undefined;
};

export async function databaseRequest({
	query,
	variables,
}: DatabaseRequestParams) {
	const config = {
		useRelativeMedia: true,
	} as any;

	const result = await resolve({
		config,
		database,
		query,
		variables,
		verbose: true,
	});

	return result;
}

export function getDatabaseConnection<GenQueries = Record<string, unknown>>({
	queries,
}: {
	queries: (client: {
		request: TinaClient<GenQueries>["request"];
	}) => GenQueries;
}) {
	const request = async ({ query, variables }: DatabaseRequestParams) => {
		const data = await databaseRequest({ query, variables });
		return {
			data: data.data as any,
			query,
			variables,
			errors: data.errors,
		};
	};
	const q = queries({
		request,
	});
	return { queries: q, request };
}

export const dbConnection = getDatabaseConnection({ queries });
