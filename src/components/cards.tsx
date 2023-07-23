import { styled } from "@styled-system/jsx";

export const Cards = styled("ul", {
  base: {
    padding: "0",
    "& h3": {
      margin: "0",
    },
    listStyleType: "none",
    margin: "0.5rem 0",
  },
});

export const Card = styled("li", {
  base: {
    marginBlock: "5",
    borderRadius: "md",
  },
});
