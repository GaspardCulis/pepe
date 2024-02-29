export const prerender = false;

import * as crypto from "crypto";
import { spawn } from "node:child_process";
import type { APIRoute } from "astro";

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

	// Pull the latest changes
	const pullProcess = spawn("git", ["pull"]);
	pullProcess.on("data", (data) => {
		console.error(`/api/tina/pushcallback: pullProcess -> stderr: ${data}`);
	});

	try {
		const code: number = await new Promise((resolve, reject) => {
			pullProcess.once("close", resolve);
			pullProcess.once("error", reject);
		});
		if (code != 0) {
			return new Response(
				`Pull process exited with non-zero error code: (${code})`,
				{ status: 500 },
			);
		}
	} catch (e) {
		return new Response(`Error: ${(e as Error).message}`, { status: 500 });
	}

	// Rebuild project
	const buildProcess = spawn("bun", ["run", "build"]);
	buildProcess.on("data", (data) => {
		console.error(
			`/api/tina/pushcallback: buildProcess -> stderr: ${data}`,
		);
	});

	try {
		const code: number = await new Promise((resolve, reject) => {
			buildProcess.once("close", resolve);
			buildProcess.once("error", reject);
		});
		if (code != 0) {
			return new Response(
				`Build process exited with non-zero error code: (${code})`,
				{ status: 500 },
			);
		}
	} catch (e) {
		return new Response(`Error: ${(e as Error).message}`, { status: 500 });
	}

	return new Response("Success");
};
