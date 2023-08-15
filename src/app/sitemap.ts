import { getArticles } from "@/content-utils/query/articles";
import pkg from "@root/package.json";

type SITEMAPPP = Array<{
  url: string;
  lastModified?: string | Date;
}>;

export const sitemapUrl = `${pkg.homepage}/sitemap.xml`;

export default async function Sitemap(): Promise<SITEMAPPP> {
  const articles = await getArticles();
  const articleUrls = articles.map((article) => {
    return {
      url: article.canonicalUrl,
      lastModified: article.dateUpdated ?? article.dateCreated,
    };
  });
  const projectUrls = [
    {
      url: `${pkg.homepage}/projects/alanglow`,
    },
  ];
  return [
    {
      url: pkg.homepage,
      lastModified: new Date(),
    },
    ...articleUrls,
    ...projectUrls,
  ];
}
