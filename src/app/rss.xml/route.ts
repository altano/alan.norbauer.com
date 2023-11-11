import pkg from "@root/package.json";
import Rss from "rss";
import { getArticles } from "@/content-utils/query/articles";
import { feedUrl } from "./url";

export async function GET() {
  const articles = await getArticles();

  const feed = new Rss({
    title: pkg.author.name,
    managingEditor: `${pkg.author.email} (${pkg.author.name})`,
    description: pkg.description,
    feed_url: feedUrl,
    site_url: pkg.homepage,
    language: "en",
  });

  articles.forEach((article) => {
    feed.item({
      title: article.title,
      author: article.authors[0].name,
      description: article.description,
      url: article.canonicalUrl,
      date: article.dateCreated,
      categories: article.tags,
    });
  });

  return new Response(feed.xml({ indent: true }), {
    headers: {
      "Content-Disposition": `inline; filename="rss.xml"`,
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
}
