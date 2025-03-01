import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

import mdx from "@astrojs/mdx";

// https://astro.build/config
export default defineConfig({
    output: "static",
    integrations: [mdx()],
    image: {
        domains: ["pepe-cms.s3web.gasdev.fr"]
    },
    vite: {
        plugins: [tailwindcss()]
    }
});