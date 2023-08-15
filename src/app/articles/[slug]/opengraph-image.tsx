import { getArticleBySlug } from "@/content-utils/query/article";
import OpenGraphImage from "@/components/opengraph/image";

import type { ArticleProps } from "./page";

export const runtime = "edge";
export const contentType = "image/png";
export const size = {
  width: 1200,
  height: 630,
};

export default async function Image({ params }: ArticleProps) {
  const interBold = fetch(
    new URL("../../../../assets/fonts/Inter/Inter-Bold.woff", import.meta.url)
  ).then((res) => res.arrayBuffer());

  const article = await getArticleBySlug(params.slug);
  const authors = article.authors.map((a) => a.name).join(" and");

  return OpenGraphImage({
    cardProps: {
      title: article.title,
      subtitle: `by ${authors}`,
    },
    imageOptions: {
      ...size,
      fonts: [
        {
          name: "Inter",
          data: await interBold,
          style: "normal",
        },
      ],
    },
  });
}
