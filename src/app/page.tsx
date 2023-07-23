import { ArticleList } from "@/components/articles/articleList";
import Bio from "@/components/bio";
import pkg from "@root/package.json";
import { styled } from "@styled-system/jsx";
import Image from "next/image";
import lightBunny from "assets/images/1468844-bunnies-avatars/svg/068-bunny-67.svg";
import darkBunny from "assets/images/sleepy-bunny/sleep.svg";
import { css } from "@styled-system/css";
import ProjectList from "@/components/projectList";
import SiteFooter from "@/components/siteFooter";
import { SectionHeading, Title } from "@/components/headings";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: pkg.author.name,
  description: pkg.description,
};

const lightBunnyStyles = css({
  marginBlockEnd: "2rem",
  lg: {
    marginBlockStart: "5rem",
  },
  flexGrow: "0",
  _dark: {
    display: "none",
  },
});
const darkBunnyStyles = css({
  marginBlockEnd: "2rem",
  lg: {
    marginBlockStart: "5rem",
  },
  flexGrow: "0",
  filter: "invert(100%)",
  _light: {
    display: "none",
  },
});

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
        <Image
          className={lightBunnyStyles}
          src={lightBunny}
          alt="bunny"
          width={64}
          height={64}
        />
        <Image
          className={darkBunnyStyles}
          src={darkBunny}
          alt="bunny"
          width={64}
          height={64}
        />
      </Header>
      <Bio width="narrow" />
      <SectionHeading>Writing</SectionHeading>
      <ArticleList />
      <SectionHeading>Projects</SectionHeading>
      <ProjectList />
      <SiteFooter location="standalone" />
    </HomeMain>
  );
}
