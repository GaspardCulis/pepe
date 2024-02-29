const server = Bun.serve({
	async fetch(req) {
		const path = new URL(req.url).pathname;
		switch (path) {
			case "/":
				return new Response("Hello!");
			case "/api":
				return new Response("Wow a developer!");
			default:
				return new Response("Page not found", { status: 404 });
		}
	},
});

console.log(`Listening on ${server.url}`);