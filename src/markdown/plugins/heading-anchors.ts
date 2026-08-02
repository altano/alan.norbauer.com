/**
 * Replaces `rehype-autolink-headings` with `behavior: "wrap"`, which wraps a
 * heading's children in an anchor pointing at its own id.
 *
 * Ids are assigned here too (replacing `rehype-slug`), because this runs before
 * Sätteri's built-in heading-ids plugin.
 */
import { defineHastPlugin } from "satteri";
import GithubSlugger from "github-slugger";
import { HEADINGS } from "../helpers/headings.js";

export const headingAnchors = () => {
  const slugger = new GithubSlugger();
  return defineHastPlugin({
    name: "heading-anchors",
    element: {
      filter: [...HEADINGS],
      visit(node, ctx) {
        const existing = node.properties?.id;
        const id =
          typeof existing === "string" && existing.length > 0
            ? existing
            : slugger.slug(ctx.textContent(node));
        ctx.setProperty(node, "id", id);
        ctx.setProperty(node, "children", [
          {
            type: "element",
            tagName: "a",
            // Order matches rehype-autolink-headings' output so the rendered
            // HTML is byte-identical to the unified pipeline's.
            properties: {
              className: ["auto-link-toc-anchor"],
              href: `#${id}`,
            },
            children: node.children,
          },
        ]);
      },
    },
  });
};
