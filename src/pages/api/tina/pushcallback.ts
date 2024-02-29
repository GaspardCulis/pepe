export const prerender = false;

import * as crypto from "crypto";
import type { APIRoute } from "astro";

const verify_signature = (req: Request) => {
	const signature = crypto
		.createHmac("sha256", import.meta.env.GITHUB_WEBHOOK_SECRET)
		.update(JSON.stringify(req.body))
		.digest("hex");
	let trusted = Buffer.from(`sha256=${signature}`, "ascii");
	let untrusted = Buffer.from(
		`${req.headers.get("x-hub-signature-256")}`,
		"ascii",
	);
	return crypto.timingSafeEqual(trusted, untrusted);
};

export const POST: APIRoute = async ({ request }) => {
	if (!verify_signature(request)) {
		return new Response("Unauthorized", { status: 401 });
	}

	const request_json = await request.json();
	console.log("Githhub callback: ", request_json);

	return new Response();
};
