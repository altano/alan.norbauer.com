import { getArticleBySlug } from "@/content-utils/query/article";
import OpenGraphImage from "@/components/opengraph/image";
import getFonts from "@/utility/getFonts";

import type { ArticleProps } from "./page";

export const runtime = "nodejs";
export const contentType = "image/png";
export const size = {
  width: 1200,
  height: 630,
};

export default async function Image({ params }: ArticleProps) {
  const article = await getArticleBySlug(params.slug);
  const authors = article.authors.map((a) => a.name).join(" and");
  const fonts = await getFonts();

  return OpenGraphImage({
    cardProps: {
      title: article.title,
      subtitle: `by ${authors}`,
      fonts,
    },
    imageOptions: {
      ...size,
      fonts,
    },
  });
}
