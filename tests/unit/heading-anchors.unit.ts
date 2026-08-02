import { test, expect } from "@playwright/test";
import { headingAnchors } from "../../src/markdown/plugins/heading-anchors.js";
import { render, squash } from "./helpers.js";

test.describe("headingAnchors", () => {
  test("wraps heading content in a self-referencing anchor", async () => {
    const html = await render("## Hello World", headingAnchors());
    expect(squash(html)).toBe(
      '<h2 id="hello-world"><a class="auto-link-toc-anchor" href="#hello-world">Hello World</a></h2>',
    );
  });

  test("derives the id from the heading's full text content", async () => {
    const html = await render(
      "### Some `code` and *emphasis*",
      headingAnchors(),
    );
    expect(html).toContain('id="some-code-and-emphasis"');
    expect(html).toContain('href="#some-code-and-emphasis"');
  });

  test("applies to every heading level", async () => {
    const html = await render(
      ["# One", "## Two", "###### Six"].join("\n\n"),
      headingAnchors(),
    );
    expect(html).toContain('<h1 id="one">');
    expect(html).toContain('<h2 id="two">');
    expect(html).toContain('<h6 id="six">');
    expect(html.match(/auto-link-toc-anchor/g)).toHaveLength(3);
  });

  test("de-duplicates ids for repeated heading text", async () => {
    const html = await render("## Setup\n\n## Setup", headingAnchors());
    expect(html).toContain('id="setup"');
    expect(html).toContain('id="setup-1"');
    expect(html).toContain('href="#setup-1"');
  });

  test("leaves non-heading elements alone", async () => {
    const html = await render("Just a paragraph.", headingAnchors());
    expect(html).not.toContain("auto-link-toc-anchor");
  });
});
