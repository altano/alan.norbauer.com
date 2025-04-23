import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import pkg from "./package.json";
import rehypeSlug from "rehype-slug";
import remarkSectionize from "remark-sectionize";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import openGraph from "@altano/astro-opengraph";
import typedLinks from "astro-typed-links";
import browserslist from "browserslist";
import {
  browserslistToTargets,
  // type ParsedComponent
} from "lightningcss";
import icon from "astro-icon";
import expressiveCode from "astro-expressive-code";
import react from "@astrojs/react";

// mixins are buggy: https://github.com/parcel-bundler/lightningcss/issues/964
// const mixins = new Map<ParsedComponent["value"], unknown>();

// https://astro.build/config
export default defineConfig({
  site:
    process.env.NODE_ENV === "development"
      ? "http://localhost:4321"
      : pkg.homepage,
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
    ],
  },
  integrations: [
    expressiveCode({
      cascadeLayer: "code",
      themes: [
        await import("./src/styles/code-themes/firefox-light-customized.json"),
        "dracula",
      ],
      customizeTheme(theme) {
        if (theme.name.toLocaleLowerCase().includes("light")) {
          theme.name = "light";
        } else if (theme.name.toLocaleLowerCase().includes("dracula")) {
          theme.name = "dark";
        }
      },
      defaultProps: {
        // code blocks look better with scrolling rather than wrapping, I think
        wrap: false,
      },
      styleOverrides: {
        // borderWidth: "0", // This hides the active tab bottom border, can't use
        borderColor: "transparent", // make the border transparent instead
        focusBorder: "transparent",
        uiFontFamily: "var(--font-inter)",
        uiFontSize: "16px",
        codeFontFamily: "var(--font-ibm-plex-mono)",
        codeFontSize: "16px", // don't use rem, it looks like it gets applied twice (so 0.8rem is computed as 20*.8*.8=12.8 sintead of 16)
        frames: {
          frameBoxShadowCssValue: "none",
          tooltipSuccessForeground: "var(--text)",
          tooltipSuccessBackground: "var(--bg)",
        },
      },
      shiki: {
        langAlias: {
          ascii: "text",
        },
      },
    }),
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
  ],
  experimental: {
    preserveScriptOrder: true,
  },
  vite: {
    css: {
      transformer: "lightningcss",
      lightningcss: {
        // TODO: Consider disabling this and only allowing as-is CSS w/o transpilation
        targets: browserslistToTargets(
          // https://browserslist.dev/?q=Pj0gMC4yNSUgYW5kIGxhc3QgMSB5ZWFyIGFuZCBub3QgZGVhZA%3D%3D
          browserslist(">= 0.25% and last 1 year and not dead"),
        ),
        drafts: {
          // https://lightningcss.dev/transpilation.html#custom-media-queries
          customMedia: true,
        },
        // mixins are buggy: https://github.com/parcel-bundler/lightningcss/issues/964
        // // TODO Move these out to a plugin
        // customAtRules: {
        //   mixin: {
        //     prelude: "<custom-ident>",
        //     body: "style-block",
        //   },
        //   apply: {
        //     prelude: "<custom-ident>",
        //   },
        // },
        // visitor: {
        //   Rule: {
        //     custom: {
        //       mixin(rule) {
        //         mixins.set(rule.prelude.value, rule.body.value);
        //         return [];
        //       },
        //       apply(rule) {
        //         return mixins.get(rule.prelude.value);
        //       },
        //     },
        //   },
        // },
      },
    },
    build: {
      cssMinify: "lightningcss",
    },
  },
});
