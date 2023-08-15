import React from "react";
import { getArticles } from "@/content-utils/query/articles";
import { getArticleBySlug } from "@/content-utils/query/article";
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
    marginBottom: "0", // handled by gridRowGap instead
    lg: {
      fontSize: "4rem",
    },
  },
});

const Article = styled("article", {
  base: {
    "& .auto-link-toc-anchor": {
      color: "text",
      _hover: {
        _after: {
          opacity: 1,
        },
      },
      _after: {
        opacity: 0.1,
        transition: "opacity var(--durations-color-scheme)",
        content: `"\\00a0\\0023"`, // non-breaking space followed by "#"
      },
    },

    "& section.footnotes": {
      "& > ol": {
        paddingLeft: "40px",
        counterReset: "list-item 0",
        listStyleType: "decimal",
        listStylePosition: "outside",
      },
      "& :target": {
        "&::marker": {
          color: "text",
        },
        "& a": {
          color: "inherit",
        },
        color: "text.highlight",
        background: "bg.highlight",
        transition:
          "background var(--durations-slowest), color var(--durations-slowest)",
      },
    },

    "& table": {
      layerStyle: "card",
      transition: "background var(--durations-color-scheme)",
      marginBlock: "10",
      "& th, & td": {
        padding: "0.5",
        lg: {
          padding: "3",
        },
      },
      "& th": {
        fontSize: "1.5rem",
        textAlign: "left",
      },
      "& td": {
        verticalAlign: "top",
      },
    },

    "& ul:not(:first-child), ol:not(:first-child)": {
      marginBlockStart: "5",
      marginBlockEnd: "2",
    },
    "& li:not(:first-child)": {
      marginBlockStart: "2",
      marginBlockEnd: "1",
    },

    "& blockquote": {
      layerStyle: "card",
      transition: "background var(--durations-color-scheme)",
      marginBlockEnd: 0,
      "&:not(:first-child)": {
        marginBlockStart: "5",
      },
      borderLeftRadius: 0,
      borderLeftWidth: "5px",
      borderLeftColor: "var(--colors-gray-400)",
      "& p": {
        paddingLeft: "3",
      },
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

    "& img:not([data-no-style]):not([data-invertible])": {
      layerStyle: "card",
      bg: "bg.card",
      transition: "background var(--durations-color-scheme)",
    },
    "& img:not([data-no-style])": {
      "&:not(:first-child)": {
        marginBlock: "8",
      },
      lg: {
        padding: "2rem",
      },
    },
  },
});

const MetadataSections = styled("div", {
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
    fontSize: "1rem",
    lineHeight: "normal",
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
      fontSize: "1rem",
      lineHeight: "loose",
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
          <MetadataSections>
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
          </MetadataSections>
          <ArticleNav>
            <ArticleNavHeading>Table of Contents</ArticleNavHeading>
            <TableOfContents entries={article.tableOfContents} maxDepth={3} />
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
