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
import { pluginLineNumbers } from "@expressive-code/plugin-line-numbers";
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
    expressiveCode({
      plugins: [pluginLineNumbers()],
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
        showLineNumbers: true,
        overridesByLang: {
          // turn off line numbers by default for a few languages, plus
          // everything documented as being in a terminal frame at
          // https://expressive-code.com/key-features/frames/#terminal-frames
          "ascii,text,ansi,bash,bat,batch,cmd,console,powershell,ps,ps1,psd1,psm1,sh,shell,shellscript,shellsession,zsh":
            { showLineNumbers: false },
        },
      },
      styleOverrides: {
        // borderWidth: "0", // This hides the active tab bottom border, can't use
        borderColor: "transparent", // make the border transparent instead
        focusBorder: "transparent",
        uiFontFamily: "var(--font-ibm-plex-mono)",
        uiFontSize: "16px",
        codeFontFamily: "var(--font-ibm-plex-mono)",
        codeFontSize: "16px", // don't use rem, it looks like it gets applied twice (so 0.8rem is computed as 20*.8*.8=12.8 instead of 16)
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
    prettierResponse(),
  ],
  experimental: {
    preserveScriptOrder: true,
  },
});
