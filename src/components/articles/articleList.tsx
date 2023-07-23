import Link from "next/link";
import {
  Article,
  getArticles,
  getArticlesByTag,
} from "@/content-utils/query/article";
import Tags from "@/components/tags";
import { css } from "@styled-system/css";
import { styled } from "@styled-system/jsx";
import { Card, Cards } from "@/components/cards";

const articleLinkStyle = css({
  display: "block",
  textDecoration: "none",
});

const ArticleTitle = styled("h3", {
  base: {
    mb: "2px",
  },
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
        <ArticleTitle>{article.title}</ArticleTitle>
      </Link>
      <Tags tags={tags} kind="pill" />
      <span className={css({ fontSize: "16px" })}>{article.description}</span>
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
