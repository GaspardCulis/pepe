import * as crypto from "crypto";
import type { Handler } from "elysia";
import { Stream } from "@elysiajs/stream";
import { spawn } from "node:child_process";

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

export const POST: Handler = async ({ request }) => {
	const payload = await request.json();

	if (!verify_signature(request, payload)) {
		return new Response("Unauthorized", { status: 401 });
	}

	return new Stream(async (stream) => {
		// Pull the latest changes
		const pullProcess = spawn("git", ["pull"]);
		pullProcess.stdout.on("data", (data) => stream.send(data));
		pullProcess.stderr.on("data", (data) => stream.send(data));

		try {
			const code: number = await new Promise((resolve, reject) => {
				pullProcess.once("close", resolve);
				pullProcess.once("error", reject);
			});
			if (code != 0) {
				throw new Error(
					`Pull process exited with non-zero error code: (${code})`,
				);
			}
		} catch (e) {
			stream.send(Buffer.from(`Error: ${(e as Error).message}\n`));
		}

		// Rebuild project
		const buildProcess = spawn("bun", ["run", "build"]);
		buildProcess.stdout.on("data", (data) => stream.send(data));
		buildProcess.stderr.on("data", (data) => stream.send(data));

		try {
			const code: number = await new Promise((resolve, reject) => {
				buildProcess.once("close", resolve);
				buildProcess.once("error", reject);
			});
			if (code != 0) {
				throw new Error(
					`Build process exited with non-zero error code: (${code})`,
				);
			}
		} catch (e) {
			stream.send(Buffer.from(`Error: ${(e as Error).message}\n`));
		}

		stream.close();
	});
};
