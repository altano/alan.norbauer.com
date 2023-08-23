import Link from "next/link";
import { getArticles, getArticlesByTag } from "@/content-utils/query/articles";
import { css } from "@styled-system/css";
import { Card, Cards } from "@/components/cards";
import { ListHeading } from "@/components/listHeading";
import { Description } from "@/components/description";

import type { Article } from "@/content-utils/query/article";

const articleLinkStyle = css({
  display: "block",
  textDecoration: "none",
});

async function ArticleCard({ article }: { article: Article }) {
  return (
    <Card>
      <Link href={article.url} className={articleLinkStyle}>
        <ListHeading>{article.title}</ListHeading>
      </Link>
      <Description>{article.description}</Description>
    </Card>
  );
}

export async function ArticleList({ tag }: { tag?: string }) {
  const articles = tag ? await getArticlesByTag(tag) : await getArticles();

  return (
    <Cards>
      {articles.map((article, idx) => (
        <ArticleCard key={idx} article={article} />
      ))}
    </Cards>
  );
}
