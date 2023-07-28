import { Attribution } from "./attribution";
import { SubscribeLink } from "./social/subscribeLink";
import { styled } from "@styled-system/jsx";
import HomeLink from "./homeLink";
import { StyledRecipeVariantProps } from "@/utility/StyledRecipeVariantProps";
import { ThreadsLink } from "./social/threadsLink";
import { EmailLink } from "./social/emailLink";
import { GithubLink } from "./social/githubLink";

const Footer = styled("footer", {
  base: {
    display: "flex",
    paddingBlockStart: "0.5rem",
    transition: "border-color var(--durations-color-cheme)",
    flexDirection: "row",
    flexWrap: "wrap",
    fontSize: "1rem",
    gap: "1rem",
    "& > :first-child": {
      flexGrow: 1,
    },
  },
  variants: {
    location: {
      standalone: {
        marginBlock: "3rem 1.5rem",
        borderTop: "0.5px solid",
        borderColor: "text",
      },
      embedded: {
        borderTop: "0.5px solid",
        borderColor: "text",
        marginBlockStart: "1rem",
        lg: {
          marginBlockStart: "3rem",
        },
      },
    },
  },
  defaultVariants: {
    location: "standalone",
  },
});

type FooterVariantProps = StyledRecipeVariantProps<typeof Footer>;

export default function SiteFooter({
  location,
}: {
  location: FooterVariantProps["location"];
}) {
  return (
    <Footer location={location}>
      <Attribution />
      <styled.span gap="1" display="inline-flex" alignItems="center">
        <HomeLink /> &bull;{" "}
        <styled.span display="inline-flex" gap="1">
          <ThreadsLink />
          <GithubLink />
          <EmailLink />
          <SubscribeLink />
        </styled.span>
      </styled.span>
    </Footer>
  );
}
