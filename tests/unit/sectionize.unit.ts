import { test, expect } from "@playwright/test";
import { sectionize } from "../../src/markdown/plugins/sectionize.js";
import { render, squash } from "./helpers.js";

test.describe("sectionize", () => {
  test("wraps a heading and its following content in a section", async () => {
    const html = squash(await render("## Title\n\nBody text.", sectionize()));
    expect(html).toBe("<section><h2>Title</h2><p>Body text.</p></section>");
  });

  test("nests a deeper heading inside the shallower one", async () => {
    const html = squash(await render("# Top\n\n## Nested", sectionize()));
    expect(html).toBe(
      "<section><h1>Top</h1><section><h2>Nested</h2></section></section>",
    );
  });

  test("makes same-depth headings siblings, not nested", async () => {
    const html = squash(await render("## One\n\n## Two", sectionize()));
    expect(html).toBe(
      "<section><h2>One</h2></section><section><h2>Two</h2></section>",
    );
  });

  test("closes deeper sections when depth decreases", async () => {
    const html = squash(await render("## A\n\n### B\n\n## C", sectionize()));
    expect(html).toBe(
      "<section><h2>A</h2><section><h3>B</h3></section></section>" +
        "<section><h2>C</h2></section>",
    );
  });

  test("leaves content before the first heading at the top level", async () => {
    const html = squash(
      await render("Intro paragraph.\n\n## First", sectionize()),
    );
    expect(html).toBe(
      "<p>Intro paragraph.</p><section><h2>First</h2></section>",
    );
  });

  /**
   * Regression: an earlier recursive implementation grouped by the *shallowest*
   * heading depth in the document, which swallowed `h2`s appearing before the
   * first `h1` (the shape of the "against horizontal scroll" article).
   */
  test("keeps h2s preceding the first h1 as siblings of it", async () => {
    const html = squash(await render("## A\n\n## B\n\n# C", sectionize()));
    expect(html).toBe(
      "<section><h2>A</h2></section><section><h2>B</h2></section>" +
        "<section><h1>C</h1></section>",
    );
  });

  /**
   * Regression: the generated footnotes section is a sibling of the content
   * sections. In the unified pipeline this fell out for free, because
   * remark-sectionize ran on mdast before footnotes were generated.
   */
  test("keeps the footnotes section out of the last content section", async () => {
    const html = await render(
      "## Heading\n\nText with a note[^1].\n\n[^1]: The note.",
      sectionize(),
    );
    const footnotes = html.indexOf("<section data-footnotes");
    expect(footnotes).toBeGreaterThan(-1);
    // The content section must be closed before the footnotes section opens.
    expect(squash(html.slice(0, footnotes))).toContain("</section>");
  });

  test("is a no-op for documents with no headings", async () => {
    const html = squash(await render("Just a paragraph.", sectionize()));
    expect(html).toBe("<p>Just a paragraph.</p>");
  });
});
