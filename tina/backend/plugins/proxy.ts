import { Elysia } from "elysia";

export const proxy = (config: { route: string; siteUrl: string }) =>
	new Elysia({
		name: "proxy",
		seed: config,
	}).get(config.route, async ({ request }) => {
		const requestUrl = new URL(request.url);
		const redirectUrl = new URL(requestUrl.pathname, config.siteUrl);

		request.headers.set("host", new URL(config.siteUrl).host);

		const siteResponse = await fetch(redirectUrl, {
			headers: request.headers,
		});

		const responseHeaders = new Headers(siteResponse.headers);
		responseHeaders.delete("content-encoding");

		const responseBuffer = await siteResponse.arrayBuffer();

		return new Response(responseBuffer, {
			status: siteResponse.status,
			headers: responseHeaders,
		});
	});
