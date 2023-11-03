import { ArticleList } from "@/components/articles/articleList";
import Bio from "@/components/bio";
import pkg from "@root/package.json";
import { styled } from "@styled-system/jsx";
import { ThemedBunny } from "@/components/theme/themedBunny";
import ProjectList from "@/components/projectList";
import SiteFooter from "@/components/siteFooter";
import { SectionHeading, Title } from "@/components/headings";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: pkg.author.name,
  description: pkg.description,
};

const Header = styled("header", {
  base: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    mdDown: {
      flexDirection: "column",
    },
  },
});

const HomeMain = styled("main", {
  base: {
    minWidth: "320px",
    maxWidth: "breakpoint-md",
    margin: "auto",
    marginBlock: "3rem",
    container: "main / inline-size",
    smDown: {
      marginInline: "2",
    },
  },
});

export default function Home() {
  return (
    <HomeMain>
      <Header>
        <Title>{pkg.author.name}</Title>
        <ThemedBunny />
      </Header>
      <Bio width="narrow" font="normal" />
      <SectionHeading>Writing</SectionHeading>
      <ArticleList />
      <SectionHeading>Projects</SectionHeading>
      <ProjectList />
      <SiteFooter location="standalone" />
    </HomeMain>
  );
}
