/**
 * Fixture-driven snapshot tests: render a realistic document through the full
 * plugin set and snapshot the resulting HTML.
 *
 * These complement the per-plugin assertions in the sibling `*.unit.ts` files,
 * which pin specific behaviors; these catch *unintended* changes anywhere in
 * the pipeline, including plugin interactions.
 *
 * Snapshotting HTML rather than an aria snapshot is deliberate. An unnamed
 * `<section>` has no ARIA role and a wrapper `<div>` is generic, so the
 * accessibility tree shows neither — it renders our documents completely flat.
 * That would leave `sectionize` and `tableWrapper` effectively untested.
 */
import { test, expect } from "@playwright/test";
import { renderFixture } from "./helpers.js";

const FIXTURES = ["article", "heading-shapes"] as const;

/** One tag per line, indented by depth, so snapshot diffs read structurally. */
function outline(html: string): string {
  const lines: string[] = [];
  let depth = 0;
  for (const match of html.matchAll(
    /<(\/?)(section|div|h[1-6]|table|a|p|ul|ol|li|sup)\b([^>]*)>/g,
  )) {
    const [, close = "", tag = "", attrs = ""] = match;
    if (close) {
      depth = Math.max(0, depth - 1);
      continue;
    }
    const id = /\bid="([^"]+)"/.exec(attrs)?.[1];
    const cls = /\bclass="([^"]+)"/.exec(attrs)?.[1];
    const href = /\bhref="([^"]+)"/.exec(attrs)?.[1];
    const parts = [tag];
    if (id !== undefined) parts.push(`#${id}`);
    if (cls !== undefined) parts.push(`.${cls.split(" ").join(".")}`);
    if (href !== undefined) parts.push(`-> ${href}`);
    lines.push(`${"  ".repeat(depth)}${parts.join(" ")}`);
    if (!/\/>$/.test(attrs)) depth++;
  }
  return lines.join("\n");
}

for (const name of FIXTURES) {
  test.describe(`fixture: ${name}`, () => {
    test("renders the expected HTML", () => {
      expect(renderFixture(name)).toMatchSnapshot(`${name}.html`);
    });

    test("renders the expected document structure", () => {
      expect(outline(renderFixture(name))).toMatchSnapshot(
        `${name}.outline.txt`,
      );
    });
  });
}
