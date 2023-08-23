import Link from "next/link";
import { getArticles, getArticlesByTag } from "@/content-utils/query/articles";
import { Tags } from "@/components/tags";
import { css } from "@styled-system/css";
import { Card, Cards } from "@/components/cards";
import { ListHeading } from "@/components/listHeading";
import { Description } from "@/components/description";

import type { Article } from "@/content-utils/query/article";

const articleLinkStyle = css({
  display: "block",
  textDecoration: "none",
});

async function ArticleCard({
  article,
  tagToOmit,
}: {
  article: Article;
  tagToOmit?: string;
}) {
  const tags =
    tagToOmit == null
      ? article.tags
      : // Don't render the tag page's tag in the article card. Tis redundant.
        article.tags.filter((t) => t !== tagToOmit);
  return (
    <Card>
      <Link href={article.url} className={articleLinkStyle}>
        <ListHeading>{article.title}</ListHeading>
      </Link>
      <Description>{article.description}</Description>
      <Tags tags={tags} kind="pill" />
    </Card>
  );
}

export async function ArticleList({ tag }: { tag?: string }) {
  const articles = tag ? await getArticlesByTag(tag) : await getArticles();

  return (
    <Cards>
      {articles.map((article, idx) => (
        <ArticleCard key={idx} article={article} tagToOmit={tag} />
      ))}
    </Cards>
  );
}
