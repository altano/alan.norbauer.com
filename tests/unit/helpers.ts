/**
 * Shared helpers for the markdown plugin unit tests.
 *
 * Not named `*.unit.ts`, so Playwright's `unit` project does not collect it as a
 * test file.
 */
import { markdownToHtml, type HastPluginInput } from "satteri";
import { readFileSync } from "node:fs";
import { headingAnchors } from "../../src/markdown/plugins/heading-anchors.js";
import { tableWrapper } from "../../src/markdown/plugins/table-wrapper.js";
import { sectionize } from "../../src/markdown/plugins/sectionize.js";

/**
 * `markdownToHtml` only resolves to a plain value when TypeScript can prove
 * every visitor is synchronous; a general `HastPluginInput[]` widens it to a
 * promise. Awaiting is correct either way.
 */
export async function render(
  markdown: string,
  ...plugins: HastPluginInput[]
): Promise<string> {
  return (await markdownToHtml(markdown, { hastPlugins: plugins })).html;
}

/**
 * Normalise formatting whitespace so assertions describe structure rather than
 * layout. Whitespace *between* tags is insignificant here — and where it lands
 * (inside vs. after a `<section>`) is an artifact of which node the text
 * follows, not something these plugins should be pinned to.
 */
export function squash(html: string): string {
  return html.replace(/\s+/g, " ").replace(/>\s+</g, "><").trim();
}

/**
 * Renders a fixture through the full plugin set, in the same order as
 * `markdown.processor` in astro.config.ts.
 *
 * No `await`: with a concrete plugin list TypeScript can prove every visitor is
 * synchronous, so `markdownToHtml` resolves to a plain result rather than a
 * promise.
 */
export function renderFixture(name: string): string {
  const markdown = readFileSync(
    new URL(`./fixtures/${name}.md`, import.meta.url),
    "utf8",
  );
  const { html } = markdownToHtml(markdown, {
    hastPlugins: [sectionize(), headingAnchors(), tableWrapper()],
  });
  return html;
}
