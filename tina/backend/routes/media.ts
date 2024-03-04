export const prerender = false;

import path from "path";
import sharp from "sharp";
import type { Handler } from "elysia";
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

export const GET: Handler = async ({ request }) => {
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

export const POST: Handler = async ({ request }) => {
	const formData = await request.formData();

	const directory = formData.get("directory") as string;
	const filename = formData.get("filename") as string;
	const file = formData.get("file") as File;
	let key = path.join(
		directory.replace(/^\//, "").replace(/\/$/, ""),
		filename,
	);

	console.log("[POST] /media: Starting to upload " + key);

	// Load image from client
	let buffer: Buffer;
	try {
		var t0 = performance.now();
		const array_buffer = await file.arrayBuffer();
		buffer = Buffer.from(array_buffer);
		console.log(
			"[POST] /media: Loading file took " +
				Math.round(performance.now() - t0) +
				"ms",
		);
	} catch (e) {
		console.error("[POST] /media: Failed to load client file: ", e);
		return new Response("Failed to load file", { status: 500 });
	}

	// Optimize image
	try {
		var t0 = performance.now();
		buffer = await sharp(buffer).webp({ quality: 80 }).toBuffer();
		const { dir, name } = path.parse(key);
		key = path.format({ dir, name, ext: ".webp" });
		console.log(
			"[POST] /media: Optimizing image took " +
				Math.round(performance.now() - t0) +
				"ms",
		);
	} catch (e) {
		console.error(
			"[POST] /media: Failed to optimize image with sharp: ",
			e,
		);
		return new Response("Failed to process image", { status: 500 });
	}

	// Upload image to S3
	const command = new PutObjectCommand({
		Bucket: import.meta.env.AWS_BUCKET_NAME,
		Key: key,
		Body: buffer,
	});

	try {
		console.log("[POST] /media: Starting to upload file to S3");
		const t0 = performance.now();
		await client.send(command);
		console.log(
			"[POST] /media: Uploading file to S3 took " +
				Math.round(performance.now() - t0) +
				"ms",
		);

		const webEndpointURL = new URL(import.meta.env.AWS_WEB_ENDPOINT_URL);
		webEndpointURL.hostname = `${import.meta.env.AWS_BUCKET_NAME}.${webEndpointURL.hostname}`;
		webEndpointURL.pathname = key;
		const src = webEndpointURL.toString();

		return new Response(
			JSON.stringify({
				id: key,
				type: "file",
				filename,
				directory,
				src,
				thumbnails: {
					"75x75": src,
					"400x400": src,
					"1000x1000": src,
				},
			}),
		);
	} catch (e) {
		return new Response("Failed to upload file to S3", { status: 500 });
	}
};

export const DELETE: Handler = async ({ request }) => {
	const key = new URL(request.url).searchParams.get("key");
	if (!key) {
		return new Response(
			JSON.stringify({ error: "Missing key URL parameter" }),
			{
				status: 400,
			},
		);
	}

	try {
		await client.send(
			new DeleteObjectCommand({
				Bucket: import.meta.env.AWS_BUCKET_NAME,
				Key: key,
			}),
		);
	} catch (e) {
		return new Response("Failed to delete " + key, { status: 500 });
	} finally {
		return new Response();
	}
};
