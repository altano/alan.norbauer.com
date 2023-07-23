import { styled } from "@styled-system/jsx";

export const Tag = styled("li", {
  base: {
    layerStyle: "card",
    bg: "bg.tag",
    borderRadius: "sm",
    transition:
      "color var(--durations-color-scheme), background var(--durations-color-scheme)",
    padding: "0.125rem",
    listStyleType: "none",
    fontSize: "14px",
    _hover: {
      color: "text.button",
    },
    overflowWrap: "initial",
  },
  variants: {
    kind: {
      pill: {
        marginRight: "0.5",
      },
      inline: {
        display: "inline",
        fontSize: "inherit",
        paddingInline: "3",
      },
      navPill: {
        marginRight: "0.5",
        lg: {
          color: "text.faded",
          "& >  a:not(:hover)": {
            color: "inherit",
          },
        },
      },
    },
  },
  defaultVariants: {
    kind: "pill",
  },
});
