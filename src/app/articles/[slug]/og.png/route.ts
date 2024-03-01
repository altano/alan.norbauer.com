import { getArticles } from "@/content-utils/query/articles";
import { getArticleBySlug } from "@/content-utils/query/article";
import OpenGraphImage from "@/components/opengraph/image";
import getFonts from "@/utility/getFonts";
import type { ArticleProps } from "../page";

const size = {
  width: 1200,
  height: 630,
};

export async function generateStaticParams(): Promise<
  ArticleProps["params"][]
> {
  const articles = await getArticles();
  return articles.map((a) => ({ slug: a.slug }));
}

export async function GET(
  _req: Request,
  { params }: { params: { slug: string } },
) {
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
