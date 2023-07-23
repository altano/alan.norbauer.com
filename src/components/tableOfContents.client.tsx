"use client";

import React from "react";
import { useVisibilityOfTarget } from "@altano/use-toc-visible-sections";
import { styled } from "@styled-system/jsx";

import type { TableOfContentsEntry } from "@altano/remark-mdx-toc-with-slugs";

const List = styled("ul", {
  base: {
    textDecoration: "none",
    margin: "0",
    padding: "0",
    "& a": {
      textDecoration: "none",
    },
    mdDown: {
      listStylePosition: "inside",
      listStyleType: "square",
    },
  },
});

const ListItem = styled("li", {
  base: {
    mdDown: {
      '&:not([aria-level="0"])': {
        paddingLeft: "4",
      },
    },
    lg: {
      // cumulative indentation
      padding: "0.125rem",
      '&:not([aria-level="0"])': {
        paddingLeft: "5",
      },

      // Faded out unless visible or nav is hovered
      transition: "color var(--durations-color-scheme)",
      "& a:not(:hover)": {
        color: "inherit",
      },
      color: "text.faded",
      "&[aria-current=true]": {
        color: "text",
      },
      "nav:hover &": {
        color: "text",
      },
    },
  },
});

const TableOfContentsItem = ({
  item,
  depth,
}: {
  item: TableOfContentsEntry;
  depth: number;
}) => {
  const url = `#${item.slug}`;
  const isVisible = useVisibilityOfTarget(url);

  return (
    <ListItem aria-level={depth} aria-current={isVisible} key={item.value}>
      <a href={url}>{item.value}</a>
      {item.children && (
        <TableOfContents entries={item.children} depth={depth + 1} />
      )}
    </ListItem>
  );
};

type Props = {
  entries: TableOfContentsEntry[];
  depth?: number;
};

const TableOfContents = ({ entries: items, depth = 0 }: Props) =>
  items == null ? null : (
    <List>
      {items.map((item) => (
        <TableOfContentsItem
          key={item.value}
          depth={depth}
          item={item}
        ></TableOfContentsItem>
      ))}
    </List>
  );

export default TableOfContents;
