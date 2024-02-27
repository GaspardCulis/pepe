export const prerender = false;

import path from "path";
import type { APIRoute } from "astro";
import { isAuthorized } from "../../../../lib/utils";
import {
	S3Client,
	PutObjectCommand,
	DeleteObjectCommand,
	ListObjectsCommand,
} from "@aws-sdk/client-s3";

const client = new S3Client({
	region: import.meta.env.AWS_DEFAULT_REGION,
	endpoint: import.meta.env.AWS_ENDPOINT_URL,
	credentials: {
		accessKeyId: import.meta.env.AWS_ACCESS_KEY_ID,
		secretAccessKey: import.meta.env.AWS_SECRET_ACCESS_KEY,
	},
});

export const GET: APIRoute = async ({ request }) => {
	const authorized = await isAuthorized(
		request.headers,
		"https://danielculis.fr/api",
		["read:media"],
	).catch((e) => {
		console.error(e);
		return false;
	});
	if (!authorized) {
		return new Response(JSON.stringify({ error: "Unautorized" }), {
			status: 403,
		});
	}

	const query = new URL(request.url).searchParams.get("query");
	if (!query) {
		return new Response(
			JSON.stringify({ error: "Missing query URL parameter" }),
			{
				status: 400,
			},
		);
	}

	const request_json = JSON.parse(query);

	const { directory, limit, offset } = request_json;
	let prefix = (directory || "").replace(/^\//, "").replace(/\/$/, "");
	if (prefix) prefix = prefix + "/";

	const objects = await client.send(
		new ListObjectsCommand({
			Bucket: import.meta.env.AWS_BUCKET_NAME,
			MaxKeys: limit,
			Delimiter: "/",
			Prefix: prefix,
			Marker: offset,
		}),
	);

	const media_list: {
		id: string;
		type: string;
		filename: string;
		directory: string;
		src?: string;
		thumbnails?: {
			[name: string]: string;
		};
	}[] = [];

	objects?.CommonPrefixes?.forEach((e) => {
		media_list.push({
			id: e.Prefix!,
			type: "dir",
			filename: path.basename(e.Prefix!),
			directory: path.dirname(e.Prefix!),
		});
	});

	objects?.Contents?.forEach((e) => {
		const webEndpointURL = new URL(import.meta.env.AWS_WEB_ENDPOINT_URL);
		webEndpointURL.hostname = `${import.meta.env.AWS_BUCKET_NAME}.${webEndpointURL.hostname}`;
		webEndpointURL.pathname = e.Key!;
		const src = webEndpointURL.toString();

		media_list.push({
			id: e.Key!,
			type: "file",
			filename: path.basename(e.Key!),
			directory: path.dirname(e.Key!),
			src,
			thumbnails: {
				"75x75": src,
				"400x400": src,
				"1000x1000": src,
			},
		});
	});

	const response_json = {
		items: media_list,
		nextOffset: objects.IsTruncated ? objects.Contents?.at(-1)?.Key : null,
	};

	return new Response(JSON.stringify(response_json));
};
