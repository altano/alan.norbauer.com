import { css } from "@styled-system/css";
import { styled } from "@styled-system/jsx";
import Link from "next/link";
import { Tag } from "@/components/tag";

import type { StyledRecipeVariantProps } from "@/utility/StyledRecipeVariantProps";

const TagList = styled("ul", {
  base: {
    p: 0,
    m: 0,
    display: "inline-flex",
    flexWrap: "wrap",
    gap: "2",
    marginRight: "2",
    listStyleType: "none",
  },
});

const linkStyle = css({
  padding: "1",
  textDecoration: "none",
});

type TagProps = StyledRecipeVariantProps<typeof Tag>;

export default function Tags({
  tags,
  kind,
}: {
  tags: string[];
  kind: TagProps["kind"];
}) {
  if (tags.length === 0) {
    return null;
  }
  return (
    <TagList>
      {tags.map((tag) => (
        <Tag key={tag} kind={kind}>
          <Link href={`/tags/${tag}`} className={linkStyle}>
            {tag}
          </Link>
        </Tag>
      ))}
    </TagList>
  );
}
