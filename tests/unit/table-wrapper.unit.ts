import { test, expect } from "@playwright/test";
import { tableWrapper } from "../../src/markdown/plugins/table-wrapper.js";
import { render, squash } from "./helpers.js";

const TABLE = ["| a | b |", "| - | - |", "| 1 | 2 |"].join("\n");

test.describe("tableWrapper", () => {
  test("wraps a table in div.markdown-table-wrapper", async () => {
    const html = squash(await render(TABLE, tableWrapper()));
    expect(html).toContain('<div class="markdown-table-wrapper"><table>');
    expect(html).toContain("</table></div>");
  });

  test("wraps each table independently", async () => {
    const html = await render(`${TABLE}\n\ntext\n\n${TABLE}`, tableWrapper());
    expect(html.match(/markdown-table-wrapper/g)).toHaveLength(2);
    expect(html.match(/<table>/g)).toHaveLength(2);
  });

  test("does not wrap documents without tables", async () => {
    const html = await render("# No tables here", tableWrapper());
    expect(html).not.toContain("markdown-table-wrapper");
  });
});
