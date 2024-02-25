import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";
import vercel from "@astrojs/vercel/serverless";

const tina = ({ directiveName = "tina" } = {}) => ({
	name: "tina-cms",
	hooks: {
		"astro:config:setup": ({ addClientDirective, opts }) => {
			addClientDirective({
				name: directiveName,
				entrypoint: "./client-directives/tina.mjs",
			});
		},
	},
});

// https://astro.build/config
export default defineConfig({
	output: "hybrid",
	redirects: {
		"/admin": "/admin/index.html",
	},
	integrations: [tailwind(), react(), tina()],
	adapter: vercel(),
});
