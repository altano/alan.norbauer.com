import { defineGlobalStyles } from "@pandacss/dev";

export const globalCss = defineGlobalStyles({
  html: {
    scrollPaddingBlockStart: "3",
    scrollBehavior: "smooth",
    _motionReduce: {
      scrollBehavior: "auto",
    },
    transition:
      "color var(--durations-color-scheme), background var(--durations-color-scheme)",
  },

  "::selection": {
    background: "var(--colors-bg-selection)",
    color: "var(--colors-text-selection)",
  },

  body: {
    minHeight: "100vh",
  },

  // Links
  "a, a:visited": {
    color: "text",
    transition: "color var(--durations-color-scheme)",

    textDecoration: "underline", // TODO Revisit
  },

  "a:hover": {
    color: "accent.primary", // TODO Revisit
  },

  // Headings
  h1: {
    fontSize: "6rem",
    margin: "3rem 0 1.5rem 0",
    fontWeight: "800",
    lineHeight: "1", // TODO Revisit
  },
  h2: {
    fontSize: "3rem",
    margin: "3rem 0 1.5rem 0",
    fontWeight: "700",
    textDecoration: "underline",
    textUnderlineOffset: "0.3rem",
    textDecorationThickness: "4px",
    lineHeight: "1.1", // TODO Revisit
  },
  h3: {
    fontSize: "2rem",
  },
  h4: {
    fontSize: "1.5rem",
  },
  "h5, h6": {
    fontSize: "1.2rem",
  },
  "h3, h4, h5, h6": {
    marginBlock: "2rem 1rem",
    fontWeight: "600",
    lineHeight: "1.1", // TODO Revisit
  },

  // Heading links
  ":is(h1, h2, h3, h4, h5, h6) > a": {
    textDecoration: "inherit",
  },

  // Paragraphs
  "p:not(:first-child)": {
    marginBlockStart: "5",
  },

  "p:last-child": {
    marginBlockEnd: "2",
  },

  code: {
    fontSize: "16px",
    fontFamily: "var(--font-ibm-plex-mono)",
    /**
     * Let's us draw ASCII diagrams for binary
     */
    "&[class='language-binary']": {
      lineHeight: "1",
      // Plex Mono doesn't render ascii art correctly for some reason
      fontFamily: "PT Mono,Consolas,Monaco,Andale Mono,Ubuntu Mono,monospace",
    },
  },

  "img[data-invertible]": {
    _dark: {
      filter: "invert(100%)",
    },
  },

  em: {
    fontStyle: "italic",
  },
});
