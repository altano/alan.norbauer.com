import { styled } from "@styled-system/jsx";

export const Title = styled("h1", {
  base: {
    fontSize: "9rem",
    fontWeight: "800",
    lineHeight: "none",
    flexGrow: "1",
    marginBlock: "3rem",
    smDown: {
      fontSize: "clamp(3rem, 19vw, 6rem)",
    },
    mdDown: {
      fontSize: "6rem",
    },
  },
});

export const SectionHeading = styled("h2", {
  base: {
    fontSize: "4rem",
    fontWeight: "600",
    mb: 10,
    smDown: {
      fontSize: "clamp(1.5rem, 12vw, 3rem)",
    },
    mdDown: {
      fontSize: "3rem",
    },
  },
});
