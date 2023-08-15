import React from "react";
import { getArticles } from "@/content-utils/query/articles";
import Link from "next/link";
import { css } from "@styled-system/css";
import { styled } from "@styled-system/jsx";

import type { Article } from "@/content-utils/query/article";

const seriesStyles = css({
  layerStyle: "card",
  transition: "background var(--durations-color-scheme)",

  marginBlockEnd: "5",
  fontStyle: "italic",
});

export default async function ArticleSeries({
  currentArticle,
}: {
  currentArticle: Article;
}) {
  const articles = await getArticles();
  const { series } = currentArticle;

  if (series == null) {
    return null;
  }

  const otherArticlesInSeries = articles.filter(
    (a) => a.series === currentArticle.series
  );

  if (otherArticlesInSeries.length === 0) {
    return null;
  }

  return (
    <div className={seriesStyles}>
      This article is part of a series on {series}. Other articles in the
      series:
      <styled.ol marginBlockStart="3">
        {otherArticlesInSeries.map((article) => (
          <li key={article.slug}>
            {article.slug === currentArticle.slug ? (
              <b>{article.title} &lt;== you are here</b>
            ) : (
              <Link href={article.url}>{article.title}</Link>
            )}
          </li>
        ))}
      </styled.ol>
    </div>
  );
}
