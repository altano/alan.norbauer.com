import React from "react";
import { styled } from "@styled-system/jsx";
import { FeedLink } from "./social/feedLink";
import { EmailLink } from "./social/emailLink";
import Link from "next/link";

import type { StyledRecipeVariantProps } from "../utility/StyledRecipeVariantProps";

const Sentence = styled("p", {
  base: {
    marginBottom: "1rem",
    "&:last-child": {
      marginBottom: "0",
    },
  },
});

const Heading = styled("h1", {
  base: {
    textTransform: "uppercase",
    marginTop: 0,
    marginBottom: "1rem",
    fontSize: "1rem",
    lineHeight: "normal",
    fontWeight: "800",
  },
});

const BioSection = styled("section", {
  base: {
    lineHeight: "1.5",
  },
  variants: {
    font: {
      small: {
        fontSize: "1rem",
      },
      normal: {},
    },
    width: {
      narrow: {
        columnCount: 1,
      },
      wide: {
        columnCount: 1,
        lg: {
          columnCount: "auto",
          columnWidth: "16rem",
        },
      },
    },
  },
  defaultVariants: {
    width: "narrow",
  },
});

type BioSectionVariants = StyledRecipeVariantProps<typeof BioSection>;

type Props = {
  width: Required<NonNullable<BioSectionVariants>>["width"];
  font: Required<NonNullable<BioSectionVariants>>["font"];
};

const Bio = ({ width, font }: Props) => {
  const iconSize = font === "small" ? 14 : undefined;
  return (
    <>
      {width === "wide" && <Heading>About the Author</Heading>}
      <BioSection width={width} font={font}>
        <Sentence>
          Alan Norbauer lives in{" "}
          <a href="https://en.wikipedia.org/wiki/Weetzie_Bat">Los Angeles</a>{" "}
          where he wrangles JavaScript for Netflix.{" "}
        </Sentence>
        <Sentence>
          He's extremely relieved to no longer be living in{" "}
          <a href="https://www.ted.com/talks/james_howard_kunstler_dissects_suburbia">
            Silicon Valley
          </a>{" "}
          which almost killed his soul.
        </Sentence>
        <Sentence>
          Alan is so old that you should call him "gramps." Alan enjoys{" "}
          <a href="https://www.youtube.com/watch?v=K0XJJBCX1O0">bad music</a>{" "}
          and{" "}
          <a href="https://www.amazon.com/South-Border-West-Sun-Novel/dp/0679767398">
            bad novels
          </a>
          . His politics are succinctly{" "}
          <Link href="https://www.youtube.com/watch?v=pRl212Y440Q">
            summarized by Divine
          </Link>
          . He still doesn't know how to use Snapchat or TikTok.
        </Sentence>
        <Sentence>
          If you'd like to know a little about Alan's personal life you can take
          a peek at{" "}
          <a href="https://facebook.com/alan.norbauer">his facebook profile</a>,
          or if you'd like to know way too much about his personal life you can
          watch <a href="https://youtu.be/vQYUwZFVbjg">this documentary</a> on
          Youtube.
        </Sentence>
        <Sentence>
          Opinions expressed are solely his own and do not express the views or
          opinions of his employer.
        </Sentence>
        <Sentence>
          You can subscribe to this site's{" "}
          <FeedLink text="RSS feed" width={iconSize} height={iconSize} />. You
          reach Alan by{" "}
          <EmailLink text="email" width={iconSize} height={iconSize} /> or
          through <Link href="/contact">another contact method</Link>.
        </Sentence>
      </BioSection>
    </>
  );
};

export default Bio;
