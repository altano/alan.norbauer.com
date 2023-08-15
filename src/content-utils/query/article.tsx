import { ArticleFrontmatter } from "../schema/article";
import { notFound } from "next/navigation";
import nullthrows from "nullthrows";
import pkg from "@root/package.json";

import type { Author } from "next/dist/lib/metadata/types/metadata-types";
import type { TableOfContentsEntry } from "@altano/remark-mdx-toc-with-slugs";

export type Article = {
  Component: React.ComponentType;
  authors: Required<Author>[];
  slug: string;
  url: string;
  markdownSourceUrl: string;
  canonicalUrl: string;
  title: string;
  dateCreated: Date;
  dateUpdated: Date | undefined;
  description: string;
  draft: boolean;
  tags: string[];
  tableOfContents: TableOfContentsEntry[];
  series: string | undefined;
};
export async function constructArticleFromSlug(slug: string): Promise<Article> {
  const articleModule = await getArticleModuleFromSlug(slug);
  const { default: Component } = articleModule;
  const frontmatter = ArticleFrontmatter.parse(articleModule.frontmatter);
  const url = `/articles/${slug}/`;
  const title = frontmatter.draft
    ? `🚧 ${frontmatter.title}`
    : frontmatter.title;

  return {
    Component,
    slug: slug,
    title: title,
    dateCreated: frontmatter.date_created,
    dateUpdated: frontmatter.date_updated,
    description: frontmatter.description,
    draft: frontmatter.draft,
    tags: frontmatter.tags,
    authors: frontmatter.authors,
    url,
    markdownSourceUrl: `https://github.com/altano/alan.norbauer.com/tree/main/src/content/articles/${slug}/index.mdx`,
    canonicalUrl: `${pkg.homepage}${url}`,
    tableOfContents: nullthrows(articleModule.tableOfContents),
    series: frontmatter.series ?? undefined,
  } satisfies Article;
}

async function getArticleModuleFromSlug(slug: string) {
  return import(`../../content/articles/${slug}/index.mdx`);
}
/**
 * Get one article. Does same filtering as `getArticles` (i.e. no drafts in production)
 */

export async function getArticleBySlug(slug: string): Promise<Article> {
  try {
    return await constructArticleFromSlug(slug);
  } catch (e) {
    notFound();
  }
}
