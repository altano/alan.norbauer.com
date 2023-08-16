import { getArticleBySlug } from "@/content-utils/query/article";
import OpenGraphImage from "@/components/opengraph/image";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { readFile } from "node:fs/promises";

import type { ArticleProps } from "./page";

export const runtime = "nodejs";
export const contentType = "image/png";
export const size = {
  width: 1200,
  height: 630,
};

export default async function Image({ params }: ArticleProps) {
  const interBold = await readFile(
    path.join(
      fileURLToPath(import.meta.url),
      "../../../../../public/fonts/Inter/static/Inter-Bold.ttf"
    )
  );
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
          data: interBold,
          style: "normal",
        },
      ],
    },
  });
}
