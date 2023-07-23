import { getArticleBySlug } from "@/content-utils/query/article";
import OpenGraphImage from "@/components/opengraph/image";

import type { ArticleProps } from "./page";

export default async function og({ params }: ArticleProps) {
  const article = await getArticleBySlug(params.slug);
  const authors = article.authors.map((a) => a.name).join(" and");

  return OpenGraphImage({
    title: article.title,
    subtitle: `by ${authors}`,
  });
}
