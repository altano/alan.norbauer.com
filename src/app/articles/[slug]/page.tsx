import React from "react";
import { getArticleBySlug, getArticles } from "@/content-utils/query/article";
import { styled } from "@styled-system/jsx";
import notNullish from "@/utility/notNullish";
import TableOfContents from "@/components/tableOfContents.client";
import DateTime from "@/components/dateTime";
import ArticleSeries from "@/components/articleSeries";
import Image from "next/image";
import calendarIcon from "assets/images/icons/calendar.svg";
import markdownIcon from "assets/images/icons/markdown.svg";
import tagIcon from "assets/images/icons/tag.svg";
import Tags from "@/components/tags";
import Link from "next/link";

import type { Metadata, ResolvingMetadata } from "next";

export type ArticleProps = {
  params: { slug: string };
};

export const dynamic = "error";

export async function generateMetadata(
  { params }: ArticleProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = params;
  const parentMetadata = await parent;
  const article = await getArticleBySlug(slug);
  const articleAuthors = article.authors ?? [];
  const parentAuthors = parentMetadata.authors ?? [];
  const parentKeywords = parentMetadata.keywords ?? [];
  const authors = [...parentAuthors, ...articleAuthors];
  const keywords = [...article.tags, ...parentKeywords];

  return {
    title: article.title,
    description: article.description,
    authors,
    keywords,

    openGraph: {
      title: article.title,
      description: article.description,
      type: "article",
      authors: authors.map((a) => a.name).filter(notNullish),
      tags: keywords,
    },
  };
}

const ArticleTitle = styled("h1", {
  base: {
    gridArea: "title",
    maxWidth: "100%",
    fontSize: "4rem",
    lg: {
      fontSize: "4rem",
      marginBottom: "0", // handled by gridGap instead
    },
  },
});

const Article = styled("article", {
  base: {
    "& .auto-link-toc-anchor": {
      _after: {
        content: `" #"`,
        display: "inline-block",
        position: "absolute",
        color: "text.faded",
        marginLeft: "2", // TODO Customize by heading size
        textDecoration: "none",
      },
    },

    "& section.footnotes > ol": {
      paddingLeft: "40px",
      counterReset: "list-item 0",
      listStyleType: "decimal",
      listStylePosition: "outside",
    },

    gridArea: "article",
    maxWidth: "100%",

    // For articles shorter than the viewport
    alignSelf: "flex-start",

    lg: {
      marginInline: "auto",
    },

    "& ol, ul": {
      listStyleType: "circle",
      paddingLeft: "40px",
    },
    "& ol": {
      listStyleType: "decimal",
      paddingLeft: "40px",
    },
  },
});

const MetdataSections = styled("div", {
  base: {
    marginBlockEnd: "4",
  },
});

const MetadataSection = styled("div", {
  base: {
    color: "text",
    flexDirection: "row",
    alignItems: "center",
    gap: "5",
    marginBlock: "4",
    lg: {
      gap: "1",
      color: "text.faded",
      flexDirection: "column",
      alignItems: "flex-start",
      marginBlockStart: "8",
    },
    fontSize: "16px",
    lineHeight: "24px",
    display: "flex",
    "& span": {},
    "& img": {
      flexBasis: "24px",
      lg: {
        opacity: 0.3,
      },
    },
    "& a": {
      textDecoration: "none",
    },
    "& a:not(:hover)": {
      color: "inherit",
    },
  },
});

const ArticleNav = styled("nav", {
  base: {},
});

const ArticleHeader = styled("header", {
  base: {
    fontSize: "1rem",
    gridArea: "header",

    mdDown: {
      display: "block",
      // marginBlock: "5",
    },
  },
});

const StickyWrapper = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",

    lg: {
      flexDirection: "column-reverse",
      position: "sticky",
      alignSelf: "start",
      top: 3,
    },
  },
});

const ArticleNavHeading = styled("h2", {
  base: {
    // hideFrom: "lg",
    mdDown: {
      marginTop: 0,
    },
    lg: {
      margin: 0,
      fontSize: "16px",
      lineHeight: "30px", // TODO
      fontWeight: "700",
      textTransform: "uppercase",
      mb: "1rem",
      textDecoration: "none",
    },
  },
});

export async function generateStaticParams(): Promise<
  ArticleProps["params"][]
> {
  const articles = await getArticles();
  return articles.map((a) => ({ slug: a.slug }));
}

export default async function ArticlePage({ params }: ArticleProps) {
  const { slug } = params;
  const article = await getArticleBySlug(slug);
  const { Component, title } = article;
  const dateCreated = <DateTime date={article.dateCreated} />;
  const date =
    article.dateUpdated == null ? (
      <>
        {`Published on `}
        {dateCreated}
      </>
    ) : (
      <>
        Last updated on <DateTime date={article.dateUpdated} />
        <br />
        Originally published on {dateCreated}
      </>
    );

  return (
    <>
      <ArticleTitle>{title}</ArticleTitle>
      <ArticleHeader>
        <StickyWrapper>
          <MetdataSections>
            <MetadataSection>
              <Image
                data-invertible
                alt="Calendar"
                src={calendarIcon}
                width={18}
                height={18}
              />
              <span>{date}</span>
            </MetadataSection>
            <MetadataSection>
              <Image
                data-invertible
                alt="Tag"
                src={tagIcon}
                width={18}
                height={18}
              />
              <styled.span mt="1">
                <Tags tags={article.tags} kind="navPill" />
              </styled.span>
            </MetadataSection>
            <MetadataSection>
              <Image
                data-invertible
                alt="Markdown source"
                src={markdownIcon}
                width={24}
                height={24}
              />
              <Link href={article.markdownSourceUrl}>
                View this article's source code
              </Link>
            </MetadataSection>
          </MetdataSections>
          <ArticleNav>
            <ArticleNavHeading>Table of Contents</ArticleNavHeading>
            <TableOfContents entries={article.tableOfContents} />
          </ArticleNav>
        </StickyWrapper>
      </ArticleHeader>
      <Article>
        <ArticleSeries currentArticle={article} />
        <section>
          <Component />
        </section>
      </Article>
    </>
  );
}
