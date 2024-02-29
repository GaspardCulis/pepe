export const prerender = false;

import * as crypto from "crypto";
import type { APIRoute } from "astro";
import { handleGithubPush } from "../../../../lib/utils";

const verify_signature = (req: Request, payload: object) => {
	const signature = crypto
		.createHmac("sha256", import.meta.env.GITHUB_WEBHOOK_SECRET)
		.update(JSON.stringify(payload))
		.digest("hex");
	let trusted = Buffer.from(`sha256=${signature}`, "ascii");
	let untrusted = Buffer.from(
		`${req.headers.get("x-hub-signature-256")}`,
		"ascii",
	);
	return crypto.timingSafeEqual(trusted, untrusted);
};

export const POST: APIRoute = async ({ request }) => {
	const payload = await request.json();

	if (!verify_signature(request, payload)) {
		return new Response("Unauthorized", { status: 401 });
	}

	handleGithubPush().catch(console.error);

	return new Response("Success");
};