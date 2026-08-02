import { defineConfig, fontProviders } from "astro/config";
import { satteri } from "@astrojs/markdown-satteri";
import { sectionize } from "./src/markdown/plugins/sectionize";
import { headingAnchors } from "./src/markdown/plugins/heading-anchors";
import { tableWrapper } from "./src/markdown/plugins/table-wrapper";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import pkg from "./package.json";
import openGraph from "@altano/astro-opengraph";
import typedLinks from "astro-typed-links";
import icon from "astro-icon";
import expressiveCode from "astro-expressive-code";
import react from "@astrojs/react";
import prettierResponse from "@altano/astro-prettier-response";
import linkValidator from "astro-link-validator";
// https://astro.build/config
export default defineConfig({
  site:
    process.env.NODE_ENV === "development"
      ? "http://localhost:4321"
      : pkg.homepage,
  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: "Inter",
      cssVariable: "--font-inter",
      weights: [400, 500, 600, 700, 800],
      fallbacks: ["sans-serif"],
    },
    {
      provider: fontProviders.fontsource(),
      name: "IBM Plex Mono",
      cssVariable: "--font-ibm-plex-mono",
      weights: [400, 700],
      fallbacks: ["ui-monospace"],
    },
  ],
  devToolbar: {
    // Disable in production and testing
    enabled: process.env.NODE_ENV === "development",
  },
  markdown: {
    syntaxHighlight: false, // handle with expressive-code instead
    // POC: Sätteri (Astro 7's default processor) instead of the unified stack.
    processor: satteri({
      hastPlugins: [sectionize, headingAnchors, tableWrapper],
    }),
  },
  prefetch: true,
  integrations: [
    expressiveCode(),
    mdx(),
    sitemap(),
    icon(),
    openGraph({
      // eslint-disable-next-line @typescript-eslint/require-await
      async getImageOptions() {
        return {
          width: 1200,
          height: 630,
          fonts: ([100, 200, 300, 400, 500, 600, 700, 800, 900] as const).map(
            (weight) => {
              return {
                name: "Inter",
                path: `node_modules/@fontsource/inter/files/inter-latin-${weight}-normal.woff`,
                weight: weight,
                style: "normal",
              };
            },
          ),
        };
      },
    }),
    typedLinks(),
    react(),
    prettierResponse(),
    linkValidator(),
  ],
});
