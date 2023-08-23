import { styled } from "@styled-system/jsx";

export const Cards = styled("ul", {
  base: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    padding: "0",
    columnGap: "4rem",
    rowGap: "1rem",
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
    width: "calc(50% - 2rem)",
    gap: 2,
    marginBlockStart: 4,
    marginBlockEnd: 10,
    borderRadius: "md",
  },
});
