import { globby } from "globby";
import nullthrows from "nullthrows";

import { Article, constructArticleFromSlug } from "./article";

function getSlug(filename: string): string {
  const segments = filename
    .split("/")
    .filter(Boolean)
    .filter((segment) => segment !== "index.mdx")
    .filter((segment) => segment !== "");
  const penultimatePathSegment = segments.at(-2);
  if (penultimatePathSegment !== "articles") {
    throw new Error(`filename "${filename}" was unexpected`);
  }
  const lastPathSegment = segments.at(-1);
  return nullthrows(lastPathSegment);
}

async function getArticlesIncludingDrafts(): Promise<Article[]> {
  const files = await globby(["src/content/articles/**/*.mdx"]);
  return await Promise.all(
    files.map(async (filename) => {
      const slug = getSlug(filename);
      return constructArticleFromSlug(slug);
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

  return process.env.NODE_ENV === "development" ||
    process.env.SHOW_DRAFTS === "true"
    ? sortedArticles
    : sortedArticles.filter((article) => !article.draft);
}

export async function getArticlesByTag(tag: string): Promise<Article[]> {
  const articles = await getArticles();
  return articles.filter((a) => a.tags.includes(tag));
}
