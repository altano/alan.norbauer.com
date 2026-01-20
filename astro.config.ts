import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import pkg from "./package.json";
import rehypeSlug from "rehype-slug";
// @ts-expect-error package has no types
import rehypeWrap from "rehype-wrap-all";
import remarkSectionize from "remark-sectionize";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import openGraph from "@altano/astro-opengraph";
import typedLinks from "astro-typed-links";
import icon from "astro-icon";
import expressiveCode from "astro-expressive-code";
import react from "@astrojs/react";
import prettierResponse from "@altano/astro-prettier-response";

// https://astro.build/config
export default defineConfig({
  site:
    process.env.NODE_ENV === "development"
      ? "http://localhost:4321"
      : pkg.homepage,
  devToolbar: {
    // Disable in production and testing
    enabled: process.env.NODE_ENV === "development",
  },
  markdown: {
    syntaxHighlight: false, // handle with expressive-code instead
    remarkPlugins: [remarkSectionize],
    rehypePlugins: [
      rehypeSlug,
      [
        rehypeAutolinkHeadings,
        {
          behavior: "wrap",
          properties: {
            className: "auto-link-toc-anchor",
          },
        },
      ],
      [
        rehypeWrap,
        {
          selector: "table",
          wrapper: "div.markdown-table-wrapper",
        },
      ],
    ],
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
  ],
  experimental: {
    preserveScriptOrder: true,
  },
});
