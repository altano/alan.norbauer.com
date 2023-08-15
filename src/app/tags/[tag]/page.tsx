import { getArticles, getArticlesByTag } from "@/content-utils/query/articles";
import { Tag } from "@/components/tag";
import { styled } from "@styled-system/jsx";
import { ArticleList } from "@/components/articles/articleList";
import { notFound } from "next/navigation";
import SiteFooter from "@/components/siteFooter";
import { SectionHeading, Title } from "@/components/headings";

import type { Metadata, ResolvingMetadata } from "next";

export const dynamic = "error";

export type TagProps = {
  params: { tag: string };
};

export async function generateMetadata(
  { params }: TagProps,
  _parent: ResolvingMetadata
): Promise<Metadata> {
  const { tag } = params;
  const title = `"${tag}" tag`;
  const description = `Stuff tagged with ${tag}`;

  return {
    title,
    description,

    openGraph: {
      title,
      description,
      type: "website",
    },
  };
}

export async function generateStaticParams(): Promise<TagProps["params"][]> {
  const allTags = new Set<string>();
  const articles = await getArticles();

  for (const article of articles) {
    for (const tag of article.tags) {
      allTags.add(tag);
    }
  }

  return Array.from(allTags).map((tag) => ({ tag }));
}

const Layout = styled("main", {
  base: {
    minWidth: "320px",
    maxWidth: "breakpoint-md",
    margin: "auto",
    smDown: {
      marginInline: "2",
    },
  },
});

export default async function TagPage({ params }: TagProps) {
  const { tag } = params;
  const articles = await getArticlesByTag(tag);

  if (articles.length === 0) {
    notFound();
  }

  return (
    <Layout>
      <Title>
        Stuff related to <Tag kind="inline">{tag}</Tag>
      </Title>
      <SectionHeading>Writing</SectionHeading>
      <ArticleList tag={tag} />
      <SiteFooter location="standalone" />
    </Layout>
  );
}
