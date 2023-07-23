import mdx from "@next/mdx";
import remarkMdxTocWithSlugs from "@altano/remark-mdx-toc-with-slugs";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import remarkSectionize from "remark-sectionize";
import remarkMdxImages from "remark-mdx-images";
import remarkFrontmatter from "remark-frontmatter";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { fromHtml } from "hast-util-from-html";
import bundleAnalyzer from "@next/bundle-analyzer";
import rehypeMdxCodeProps from "rehype-mdx-code-props";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const withMDX = mdx({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [
      [remarkMdxTocWithSlugs, { name: "tableOfContents" }],
      remarkGfm,
      remarkSectionize,
      remarkFrontmatter,
      remarkMdxFrontmatter,
      remarkMdxImages,
    ],
    rehypePlugins: [
      rehypeSlug,
      [
        rehypeAutolinkHeadings,
        {
          behavior: "append",
          properties: {
            className: "auto-link-toc-anchor",
            "aria-hidden": true,
            "tab-index": -1,
          },
          content: fromHtml(
            // svg from https://boxicons.com/?query=link
            `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style="fill: rgba(0, 0, 0, 1); vertical-align: bottom;">
                <path d="M8.465 11.293c1.133-1.133 3.109-1.133 4.242 0l.707.707 1.414-1.414-.707-.707c-.943-.944-2.199-1.465-3.535-1.465s-2.592.521-3.535 1.465L4.929 12a5.008 5.008 0 0 0 0 7.071 4.983 4.983 0 0 0 3.535 1.462A4.982 4.982 0 0 0 12 19.071l.707-.707-1.414-1.414-.707.707a3.007 3.007 0 0 1-4.243 0 3.005 3.005 0 0 1 0-4.243l2.122-2.121z"></path>
                <path d="m12 4.929-.707.707 1.414 1.414.707-.707a3.007 3.007 0 0 1 4.243 0 3.005 3.005 0 0 1 0 4.243l-2.122 2.121c-1.133 1.133-3.109 1.133-4.242 0L10.586 12l-1.414 1.414.707.707c.943.944 2.199 1.465 3.535 1.465s2.592-.521 3.535-1.465L19.071 12a5.008 5.008 0 0 0 0-7.071 5.006 5.006 0 0 0-7.071 0z"></path>
              </svg>`,
            {
              space: "svg",
              fragment: true,
            }
          ),
        },
      ],
      rehypeMdxCodeProps,
    ],
    // // If you use `MDXProvider`, uncomment the following line.
    // // providerImportSource: "@mdx-js/react",
  },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // TODO Re-enable when dynamic open graph images are fixed: https://github.com/vercel/next.js/issues/51147
  // output: "export",

  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
  // images: {
  //   // TODO Can we optimize images with export somehow? Check out next-optimized-images npm package
  //   unoptimized: true,
  // },
  experimental: {
    appDir: true,
    // mdxRs: false, // Currently incompatible with remark plugins
  },
  reactStrictMode: true,
};

export default withBundleAnalyzer(withMDX(nextConfig));
