import { Attribution } from "./attribution";
import { FeedLink } from "./social/feedLink";
import { styled } from "@styled-system/jsx";
import HomeLink from "./homeLink";
import { StyledRecipeVariantProps } from "@/utility/StyledRecipeVariantProps";
import { MastodonLink } from "./social/mastodonLink";
import { ContactLink } from "./social/contactLink";

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
          <MastodonLink />
          <ContactLink />
          &bull;
          <FeedLink />
        </styled.span>
      </styled.span>
    </Footer>
  );
}
