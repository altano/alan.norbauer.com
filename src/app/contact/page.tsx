import React from "react";
import { Metadata } from "next";
import { styled } from "@styled-system/jsx";
import SiteFooter from "@/components/siteFooter";
import { SectionHeading, Title } from "@/components/headings";
import { ThreadsLink } from "@/components/social/threadsLink";
import { GithubLink } from "@/components/social/githubLink";
import { EmailLink } from "@/components/social/emailLink";
import { MastodonLink } from "@/components/social/mastodonLink";
import { FeedLink } from "@/components/social/feedLink";
import { TwitterLink } from "@/components/social/twitterLink";
import { InstagramLink } from "@/components/social/instagramLink";
import { RedditLink } from "@/components/social/redditLink";
import pkg from "@root/package.json";
import { LobstersLink } from "@/components/social/lobstersLink";
import { HackerNewsLink } from "@/components/social/hackerNewsLink";
import { FacebookLink } from "@/components/social/facebookLink";

export const metadata: Metadata = {
  title: "Contact",
  description: "How to contact Alan Norbauer",
};

const Main = styled("main", {
  base: {
    minWidth: "320px",
    maxWidth: "breakpoint-lg",
    margin: "auto",
    paddingBlock: "1rem",
    fontSize: "lg",
    sm: {
      fontSize: "2xl",
    },
    md: {
      fontSize: "2xl",
    },
    lg: {
      fontSize: "2xl",
    },
    mdDown: {
      marginInline: "2",
    },
  },
});

const Section = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  variants: {
    variant: {
      inactive: {
        filter: "grayscale(1)",
        opacity: 0.25,
      },
    },
  },
});

export default function ContactPage() {
  const size = 52;

  return (
    <Main>
      <Title>Alan on the Internet</Title>
      <SectionHeading>Boomer Shit</SectionHeading>
      <Section>
        <EmailLink
          text={`E-mail – ${pkg.author.email}`}
          height={size}
          width={size}
        />
        <FeedLink text="This Site's RSS Feed" height={size} width={size} />
      </Section>

      <SectionHeading>Programming-Focused</SectionHeading>
      <Section>
        <LobstersLink
          text={`Lobste.rs – ${pkg.author.social.lobsters}`}
          height={size}
          width={size}
        />
        <MastodonLink
          text={`Mastodon – ${pkg.author.social.mastodon}`}
          height={size}
          width={size}
        />
        <GithubLink
          text={`GitHub – ${pkg.author.social.github}`}
          height={size}
          width={size}
        />
      </Section>

      <SectionHeading>Social</SectionHeading>
      <Section>
        <ThreadsLink
          text={`Threads – ${pkg.author.social.threads}`}
          height={size}
          width={size}
        />
        <InstagramLink
          text={`Instagram – ${pkg.author.social.instagram}`}
          height={size}
          width={size}
        />
      </Section>

      <SectionHeading>Inactive</SectionHeading>
      <Section variant="inactive">
        <RedditLink
          text={`Reddit – ${pkg.author.social.reddit}`}
          height={size}
          width={size}
        />
        <HackerNewsLink
          text={`Hacker News – ${pkg.author.social.hackernews}`}
          height={size}
          width={size}
        />
        <FacebookLink
          text={`Facebook – ${pkg.author.social.facebook}`}
          height={size}
          width={size}
        />
        <TwitterLink
          text={`Twitter – ${pkg.author.social.twitter}`}
          height={size}
          width={size}
        />
      </Section>

      <SiteFooter location="standalone" />
    </Main>
  );
}
