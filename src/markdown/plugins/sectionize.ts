/**
 * Replaces `remark-sectionize`: groups each heading and the content following
 * it into a `<section>`, nesting by heading depth.
 */
import { defineHastPlugin } from "satteri";
import type { ElementContent, RootContent } from "hast";
import { HEADINGS, isHeading, headingDepth } from "../helpers/headings.js";

/**
 * The generated footnotes section is a sibling of the content sections, never
 * part of the last one. (In unified this falls out for free, because
 * remark-sectionize runs on mdast, before footnotes exist.)
 */
function isFootnotes(node: RootContent): boolean {
  return (
    node.type === "element" &&
    node.tagName === "section" &&
    node.properties?.["dataFootnotes"] !== undefined
  );
}

/**
 * A single pass with a stack of open sections: a heading closes every section at
 * its own depth or deeper, then opens its own. Anything else appends to the
 * innermost open section, so content before the first heading stays at the top
 * level without needing a special case.
 */
function groupIntoSections(children: RootContent[]): RootContent[] {
  const root: RootContent[] = [];
  const open: { depth: number; body: RootContent[] }[] = [];
  const innermost = (): RootContent[] => open[open.length - 1]?.body ?? root;

  for (const child of children) {
    if (isFootnotes(child)) {
      open.length = 0;
      root.push(child);
    } else if (isHeading(child)) {
      const depth = headingDepth(child);
      while ((open[open.length - 1]?.depth ?? 0) >= depth) open.pop();
      // `body` is the section's own children array, so later pushes land inside.
      const body: RootContent[] = [child];
      innermost().push({
        type: "element",
        tagName: "section",
        properties: {},
        children: body as ElementContent[],
      });
      open.push({ depth, body });
    } else {
      innermost().push(child);
    }
  }
  return root;
}

export const sectionize = () => {
  const done = new WeakSet<object>();
  return defineHastPlugin({
    name: "sectionize",
    element: {
      filter: [...HEADINGS],
      visit(node, ctx) {
        const parent = ctx.parent(node);
        if (!parent || !("children" in parent) || done.has(parent)) return;
        // Skip the `<section>`s this plugin created: `groupIntoSections` already
        // nested them, and re-running on them would double-wrap.
        if (parent.type === "element" && parent.tagName === "section") return;
        done.add(parent);
        ctx.setProperty(
          parent,
          "children",
          groupIntoSections(parent.children as RootContent[]),
        );
      },
    },
  });
};
