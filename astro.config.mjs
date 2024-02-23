import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";

import react from "@astrojs/react";

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
	redirects: {
		"/admin": "/admin/index.html",
	},
	integrations: [tailwind(), react(), tina()],
});
