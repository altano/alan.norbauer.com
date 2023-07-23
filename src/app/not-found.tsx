import pkg from "@root/package.json";
import { styled } from "@styled-system/jsx";
import { Title } from "@/components/headings";
import HomeLink from "@/components/homeLink";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `Not here | ${pkg.author.name}`,
  description: pkg.description,
};

const NotFoundMain = styled("main", {
  base: {
    minWidth: "320px",
    maxWidth: "breakpoint-md",
    margin: "auto",
    smDown: {
      marginInline: "2",
    },
  },
});

export default function NotFound() {
  return (
    <NotFoundMain>
      <Title>Nothing exists here.</Title>
      <styled.p fontSize="2rem" marginBlock="10">
        Go back to <HomeLink />
      </styled.p>
    </NotFoundMain>
  );
}
