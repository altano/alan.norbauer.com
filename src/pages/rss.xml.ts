import rss, { type RSSFeedItem } from "@astrojs/rss";
import pkg from "@root/package.json";
import type { APIRoute } from "astro";
import nullthrows from "nullthrows";
import {
  getArticles,
  getArticleCanonicalURL,
} from "@/content-utils/query/articles";
import { getAlan } from "@/content-utils/query/authors";

const author = await getAlan();
export const rssTitle = author.data.name;

export const GET: APIRoute = async (context) => {
  const articles = await getArticles();
  return rss({
    title: rssTitle,
    description: pkg.description,
    site: nullthrows(context.site),
    items: articles.map(
      (article) =>
        ({
          link: getArticleCanonicalURL(article),
          content: article.rendered?.html,
          title: article.data.title,
          pubDate: article.data.date_created,
          description: article.data.description,
          categories: article.data.tags,
          author: article.data.author.id,
        }) satisfies RSSFeedItem,
    ),
  });
};
