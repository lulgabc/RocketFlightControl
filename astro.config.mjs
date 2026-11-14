import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://lulgabc.github.io",
  base: "/RocketFlightControl",
  trailingSlash: "always",
  integrations: [sitemap({ filter: (page) => !page.includes("/404") })],
  build: {
    format: "directory",
  },
  markdown: {
    shikiConfig: { theme: "github-dark" },
  },
});
