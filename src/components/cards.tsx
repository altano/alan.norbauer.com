import { styled } from "@styled-system/jsx";

export const Cards = styled("ul", {
  base: {
    display: "flex",
    flexDirection: "column",
    md: {
      flexDirection: "row",
      flexWrap: "wrap",
      columnGap: "4rem",
      rowGap: "1rem",
    },
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
    md: {
      width: "calc(50% - 2rem)",
    },
    gap: 2,
    marginBlockStart: 4,
    marginBlockEnd: 10,
    borderRadius: "md",
  },
});
