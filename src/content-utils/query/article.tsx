import path from "node:path";
import { globby } from "globby";
import { ArticleFrontmatter } from "../schema/article";
import { notFound } from "next/navigation";
import nullthrows from "nullthrows";
import pkg from "@root/package.json";

import type { Author } from "next/dist/lib/metadata/types/metadata-types";
import type { TableOfContentsEntry } from "@altano/remark-mdx-toc-with-slugs";

function getSlug(filename: string): string {
  return path.basename(path.dirname(filename));
}

async function getArticleModuleFromSlug(slug: string) {
  return import(`../../content/articles/${slug}/index.mdx`);
}

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

async function getArticlesIncludingDrafts(): Promise<Article[]> {
  const files = await globby(["src/content/articles/**/*.mdx"]);
  return await Promise.all(
    files.map(async (filename) => {
      const slug = getSlug(filename);
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
    })
  );
}

function articleDateDescending(a: Article, b: Article): number {
  return +b.dateCreated - +a.dateCreated;
}

/**
 * Get Articles from newest to oldest. Filter out drafts unless in development.
 */
export async function getArticles(): Promise<Article[]> {
  const allArticles = await getArticlesIncludingDrafts();
  const sortedArticles = [...allArticles].sort(articleDateDescending);

  return process.env.NODE_ENV === "development"
    ? sortedArticles
    : sortedArticles.filter((article) => !article.draft);
}

/**
 * Get one article. Does same filtering as `getArticles` (i.e. no drafts in production)
 */
export async function getArticleBySlug(slug: string): Promise<Article> {
  const articles = await getArticles();
  const article = articles.find((a) => a.slug === slug);
  if (article == null) {
    notFound();
  }
  return article;
}

export async function getArticlesByTag(tag: string): Promise<Article[]> {
  const articles = await getArticles();
  return articles.filter((a) => a.tags.includes(tag));
}
