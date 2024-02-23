import { createDatabase, createLocalDatabase } from "@tinacms/datalayer";
import { GitHubProvider } from "tinacms-gitprovider-github/dist/index.js";
import mongodb from "mongodb-level";

const isLocal = process.env.TINA_PUBLIC_IS_LOCAL === "true";

const branch = process.env.GITHUB_BRANCH as string;

if (!branch) {
	throw new Error(
		"No branch found. Make sure that you have set the GITHUB_BRANCH or process.env.VERCEL_GIT_COMMIT_REF environment variable.",
	);
}

export default isLocal
	? // If we are running locally, use a local database that stores data in memory and writes to the locac filesystem on save
		createLocalDatabase()
	: // If we are not running locally, use a database that stores data in redis and Saves data to github
		createDatabase({
			gitProvider: new GitHubProvider({
				repo: process.env.GITHUB_REPO as string,
				owner: process.env.GITHUB_OWNER as string,
				token: process.env.GITHUB_PERSONAL_ACCESS_TOKEN as string,
				branch,
			}),
			databaseAdapter: new mongodb.MongodbLevel<
				string,
				Record<string, any>
			>({
				collectionName: `tinacms-${branch}`,
				dbName: "tinacms",
				mongoUri: process.env.MONGODB_URI as string,
			}),
		});
