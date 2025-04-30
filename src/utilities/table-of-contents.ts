import type { MarkdownHeading } from "astro";

export function shouldShowTableOfContents(
  headings: MarkdownHeading[],
): boolean {
  const isEmptyOrJustFootnotes =
    headings.length === 0 ||
    (headings.length === 1 && headings[0]?.text === "Footnotes");
  return !isEmptyOrJustFootnotes;
}
