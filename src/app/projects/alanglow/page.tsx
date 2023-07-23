import React from "react";
import metadataJSON from "./metadata.json";
import pkg from "@root/package.json";
import { Metadata } from "next";
import { styled } from "@styled-system/jsx";
import Link from "next/link";
import Image from "next/image";
import screenshot1 from "./screenshots/1-home.png";
import screenshot2 from "./screenshots/2-address.png";
import screenshot3 from "./screenshots/3-menu.png";
import screenshot4 from "./screenshots/4-tree-style-tabs.jpg";
import SiteFooter from "@/components/siteFooter";
import { SectionHeading, Title } from "@/components/headings";

const { title, description } = metadataJSON;

export const metadata: Metadata = {
  title,
  description,
  authors: [pkg.author],

  openGraph: {
    title,
    description,
    type: "website",
  },
};

const Nav = styled("nav", {
  base: {
    fontSize: "2rem",
    display: "flex",
    justifyContent: "space-between",
    marginBlock: "2rem",
  },
});

const Main = styled("main", {
  base: {
    minWidth: "320px",
    maxWidth: "breakpoint-lg",
    margin: "auto",
    mdDown: {
      marginInline: "2",
    },
  },
});

const Gallery = styled("div", {
  base: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: "1rem",
  },
});

function AlanglowPage() {
  return (
    <Main>
      <Title>{title}</Title>
      <Nav>
        <Link href="https://addons.mozilla.org/en-US/firefox/addon/alanglow/">
          Install Firefox Theme
        </Link>
      </Nav>
      <SectionHeading>About</SectionHeading>
      <section>{description}</section>

      <SectionHeading>Screenshots</SectionHeading>
      <Gallery>
        <Image width={500} alt="home" src={screenshot1} />
        <Image width={500} alt="home" src={screenshot2} />
        <Image width={500} alt="home" src={screenshot3} />
        <Image width={500} alt="home" src={screenshot4} />
      </Gallery>

      <SectionHeading>More</SectionHeading>
      <Link href="https://github.com/altano/alanglow/">Source Code</Link>
      {" / "}
      <Link href="https://github.com/altano/alanglow/issues/">Feedback</Link>

      <SiteFooter location="standalone" />
    </Main>
  );
}

export default AlanglowPage;
