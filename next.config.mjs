import mdx from "@next/mdx";
import remarkMdxTocWithSlugs from "@altano/remark-mdx-toc-with-slugs";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import remarkSectionize from "remark-sectionize";
import remarkMdxImages from "remark-mdx-images";
import remarkFrontmatter from "remark-frontmatter";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import bundleAnalyzer from "@next/bundle-analyzer";
import rehypeMdxCodeProps from "rehype-mdx-code-props";
import remarkSmartypants from "@ngsctt/remark-smartypants";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const withMDX = mdx({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [
      [remarkMdxTocWithSlugs, { name: "tableOfContents" }],
      remarkGfm,
      remarkSmartypants,
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
          behavior: "wrap",
          properties: {
            className: "auto-link-toc-anchor",
            "aria-hidden": true,
            "tab-index": -1,
          },
        },
      ],
      rehypeMdxCodeProps,
    ],
    // If you use `MDXProvider`, uncomment the following line.
    // providerImportSource: "@mdx-js/react",
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
