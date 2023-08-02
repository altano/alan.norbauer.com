import { getArticleBySlug, getArticles } from "@/content-utils/query/article";
import OpenGraphImage from "@/components/opengraph/image";

import type { ArticleProps } from "./page";

export const runtime = "nodejs";
export const contentType = "image/png";
export const dynamic = "error";

export async function generateStaticParams(): Promise<
  ArticleProps["params"][]
> {
  const articles = await getArticles();
  return articles.map((a) => ({ slug: a.slug }));
}

export default async function og({ params }: ArticleProps) {
  const article = await getArticleBySlug(params.slug);
  const authors = article.authors.map((a) => a.name).join(" and");

  return OpenGraphImage({
    title: article.title,
    subtitle: `by ${authors}`,
  });
}
