import { styled } from "@styled-system/jsx";

export const Cards = styled("ul", {
  base: {
    padding: "0",
    listStyleType: "none",
    marginBlock: "2",
    "& h3": {
      margin: "0",
    },
  },
});

export const Card = styled("li", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: 2,
    marginBlockStart: 4,
    marginBlockEnd: 10,
    borderRadius: "md",
  },
});
