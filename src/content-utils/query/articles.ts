import { type CollectionEntry, getCollection, getEntry, getEntries } from "astro:content";
import nullthrows from "nullthrows";
import { site } from "astro:config/server";
import { link } from "astro-typed-links/link";

export type Article = CollectionEntry<"articles">;

async function getArticlesIncludingDrafts(): Promise<Article[]> {
  return getCollection("articles");
}

function articleDateDescending(a: Article, b: Article): number {
  return +b.data.date_created - +a.data.date_created;
}

export function groupArticlesByYear(
  articles: Article[],
): Map<number, Article[]> {
  const articlesByYearUnsorted = new Map<number, Article[]>();
  articles.forEach((article) => {
    const year = article.data.date_created.getFullYear();
    const existing = articlesByYearUnsorted.get(year) ?? [];
    articlesByYearUnsorted.set(year, [...existing, article]);
    return articlesByYearUnsorted;
  });

  // Sort years descending
  const sortedArticlesByYearPairs = Array.from(
    articlesByYearUnsorted.entries(),
  ).sort(
    // descending
    ([a], [b]) => Number(b) - Number(a),
  );
  return new Map(sortedArticlesByYearPairs);
}

/**
 * Get Articles from newest to oldest. Filter out drafts unless in development.
 */
export async function getArticles(): Promise<Article[]> {
  const allArticles = await getArticlesIncludingDrafts();
  const sortedArticles = [...allArticles].sort(articleDateDescending);

  if (
    (process.env.NODE_ENV === "development" &&
      process.env.SHOW_DRAFTS !== "false") ||
    process.env.SHOW_DRAFTS === "true"
  ) {
    allArticles.forEach((a) => {
      if (a.data.draft) {
        a.data.title = `🚧 ${a.data.title}`;
      }
    });
  }

  return process.env.NODE_ENV === "development" ||
    process.env.SHOW_DRAFTS === "true"
    ? sortedArticles
    : sortedArticles.filter((article) => !article.data.draft);
}

export async function getArticlesByTag(tag: string): Promise<Article[]> {
  const articles = await getArticles();
  return articles.filter((a) => a.data.tags.includes(tag));
}

/**
 * Get one article. Does same filtering as `getArticles` (i.e. no drafts in production)
 */
export async function getArticleBySlug(slug: string): Promise<Article> {
  const article = await getEntry("articles", slug);
  return nullthrows(article);
}

export function getArticleURL(article: Article): string {
  return link("/articles/[slug]", { params: { slug: article.id } });
}

export function getArticleCanonicalURL(article: Article): string {
  // The canonical URL has always had a trailing slash so let's not break it.
  // Would mess up RSS readers (since this is a unique id there)
  return new URL(`/articles/${article.id}/`, site).toString();
}

export function getArticleMarkdownURL(article: Article): string {
  return `https://github.com/altano/alan.norbauer.com/tree/main/src/content/articles/${article.id}/index.mdx`;
}

export async function getArticlePrimaryAuthor(
  article: Article,
): Promise<CollectionEntry<"authors">> {
  const primaryAuthorRef = nullthrows(article.data.authors[0]);
  return nullthrows(await getEntry(primaryAuthorRef));
}

export async function getOtherArticlesInSeries(
  article: Article,
): Promise<Article[]> {
  const { series } = article.data;
  if (series == null) {
    return [];
  }
  const articles = await getArticles();
  return articles.filter((a) => a.data.series?.id === article.data.series?.id);
}

/**
 * Get all authors for an article.
 */
export async function getArticleAuthors(
  article: Article,
): Promise<CollectionEntry<"authors">[]> {
  return getEntries(article.data.authors);
}
