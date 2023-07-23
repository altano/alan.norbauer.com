import React from "react";
import { styled } from "@styled-system/jsx";
import { SubscribeLink } from "./social/subscribeLink";
import { ThreadsLink } from "./social/threadsLink";
import { EmailLink } from "./social/emailLink";

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
    // fontSize: "1rem",
    fontSize: "1rem",
    lineHeight: "24px",
    fontWeight: "800",
  },
});

const BioSection = styled("section", {
  base: {
    lineHeight: "1.5",
  },
  variants: {
    width: {
      narrow: {
        columnCount: 1,
      },
      wide: {
        columnCount: 1,
        lg: {
          columnCount: 4,
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
};

const Bio = ({ width }: Props) => {
  return (
    <BioSection width={width}>
      {width === "wide" && <Heading>About the Author</Heading>}
      <Sentence>
        Alan Norbauer lives in{" "}
        <a href="https://en.wikipedia.org/wiki/Weetzie_Bat">Los Angeles</a>{" "}
        where he wrangles JavaScript for Netflix. He's extremely relieved to no
        longer be living in{" "}
        <a href="https://www.ted.com/talks/james_howard_kunstler_dissects_suburbia">
          Silicon Valley
        </a>{" "}
        which almost killed his soul.
      </Sentence>
      <Sentence>
        Alan is so old that you should call him "gramps." Alan enjoys{" "}
        <a href="https://www.youtube.com/watch?v=K0XJJBCX1O0">bad music</a> and{" "}
        <a href="https://www.amazon.com/South-Border-West-Sun-Novel/dp/0679767398">
          bad novels
        </a>
        . He still doesn't know how to use Snapchat or TikTok.
      </Sentence>
      <Sentence>
        If you'd like to know a little about Alan's personal life you can take a
        peek at{" "}
        <a href="https://facebook.com/alan.norbauer">his facebook profile</a>,
        or if you'd like to know way too much about his personal life you can
        watch <a href="https://youtu.be/vQYUwZFVbjg">this documentary</a> on
        Youtube.
      </Sentence>
      <Sentence>
        You can subscribe to this site's <SubscribeLink text="RSS feed" /> or
        follow Alan on <ThreadsLink text="Threads" /> or reach him by{" "}
        <EmailLink text="email" />.
      </Sentence>
    </BioSection>
  );
};

export default Bio;
