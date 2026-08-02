/**
 * Replaces `rehype-wrap-all` configured with
 * `{ selector: "table", wrapper: "div.markdown-table-wrapper" }`.
 *
 * Note this wraps *every* table, including ones nested inside MDX components.
 * `rehype-wrap-all` used `hast-util-select`, which does not descend into MDX
 * JSX element nodes, so a handful of tables silently went unwrapped.
 */
import { defineHastPlugin } from "satteri";

export const tableWrapper = () =>
  defineHastPlugin({
    name: "table-wrapper",
    element: {
      filter: ["table"],
      visit(node, ctx) {
        ctx.wrapNode(node, {
          type: "element",
          tagName: "div",
          properties: { className: ["markdown-table-wrapper"] },
          children: [],
        });
      },
    },
  });
