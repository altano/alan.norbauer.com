/**
 * Cross-plugin behaviour: the plugins must compose without interfering, in the
 * same order `markdown.processor` runs them.
 *
 * Kept separate from the per-plugin files (which pin one plugin each) and from
 * the fixture snapshots (which guard against unintended change rather than
 * asserting anything specific).
 */
import { test, expect } from "@playwright/test";
import { renderFixture, squash } from "./helpers.js";

/**
 * Matches `id` wherever it appears in the tag. The generated footnotes heading
 * is `<h2 class="sr-only" id="footnote-label">`, so anchoring on `<h2 id=`
 * would silently miss it.
 */
const headingIds = (html: string): string[] =>
  [...html.matchAll(/<h[1-6]\b[^>]*\bid="([^"]+)"/g)].flatMap(
    (m) => m[1] ?? [],
  );

test.describe("all plugins", () => {
  test("sectionize nests around headings the anchors rewrite", () => {
    // sectionize wraps the heading, then headingAnchors rewrites its children.
    expect(squash(renderFixture("article"))).toContain(
      '<section><h2 id="getting-started">' +
        '<a class="auto-link-toc-anchor" href="#getting-started">',
    );
  });

  test("tables are wrapped inside the section they belong to", () => {
    expect(squash(renderFixture("article"))).toContain(
      '<div class="markdown-table-wrapper"><table>',
    );
  });

  test("heading ids stay unique across the whole document", () => {
    const ids = headingIds(renderFixture("article"));
    expect(ids.length).toBeGreaterThan(1);
    expect(new Set(ids).size).toBe(ids.length);
  });

  test("every heading gets exactly one anchor, pointing at its own id", () => {
    const html = renderFixture("article");
    const ids = headingIds(html);
    const hrefs = [
      ...html.matchAll(/<a class="auto-link-toc-anchor" href="#([^"]+)"/g),
    ].flatMap((m) => m[1] ?? []);
    expect(hrefs).toEqual(ids);
  });
});
