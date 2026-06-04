import { defineConfig } from "astro/config";

import mdx from "@astrojs/mdx";

import tailwindcss from "@tailwindcss/vite";

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
