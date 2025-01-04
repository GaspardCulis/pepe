import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
	output: "static",
	integrations: [tailwind()],
	image: {
		domains: ["pepe-cms.s3web.gasdev.fr"]
	}
});
