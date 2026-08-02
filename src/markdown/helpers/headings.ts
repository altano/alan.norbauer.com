/** Shared heading helpers for the Sätteri markdown plugins. */
import type { Element, RootContent } from "hast";

/** Ordered so an index into this list is the heading's depth minus one. */
export const HEADINGS = ["h1", "h2", "h3", "h4", "h5", "h6"] as const;

export function isHeading(node: RootContent): node is Element {
  return (
    node.type === "element" &&
    (HEADINGS as readonly string[]).includes(node.tagName)
  );
}

export function headingDepth(node: Element): number {
  return HEADINGS.indexOf(node.tagName as (typeof HEADINGS)[number]) + 1;
}
