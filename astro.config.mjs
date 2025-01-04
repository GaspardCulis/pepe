import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";

import mdx from "@astrojs/mdx";

// https://astro.build/config
export default defineConfig({
    output: "static",
    integrations: [tailwind(), mdx()],
    image: {
        domains: ["pepe-cms.s3web.gasdev.fr"]
    }
});