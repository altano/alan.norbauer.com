/**
 * Renders fenced ```mermaid code blocks to inline SVG at build time with Pele
 * (https://pele.run), so pages ship no Mermaid JavaScript.
 *
 * The SVG colors come from `--pele-*` CSS variables, set in
 * src/pages/articles/[slug]/index.astro, so one SVG serves both the light and
 * dark themes.
 *
 * This must run before Expressive Code, which would otherwise turn the block
 * into a highlighted code listing. Expressive Code appends its own plugin to
 * `hastPlugins` when its integration starts, after the ones in astro.config.ts.
 */
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { create, type Font } from "fontkitten";
import type { Element, ElementContent } from "hast";
import { fromHtml } from "hast-util-from-html";
import { PeleError, render, type TextMeasurer } from "pele";
import { defineHastPlugin } from "satteri";

const COUNTER_KEY = "mermaidDiagramCount";

// Pele's `measurer` option takes these bit flags in its `style` argument.
const BOLD = 1;
const ITALIC = 2;
const MONO = 4;

/** IBM Plex Mono, the site's monospace font, advances every glyph 0.6em. */
const MONO_ADVANCE_EM = 0.6;

const require = createRequire(import.meta.url);

function loadInter(weight: 400 | 700, style: "normal" | "italic"): Font {
  const file = require.resolve(
    `@fontsource/inter/files/inter-latin-${weight}-${style}.woff`,
  );
  const font = create(readFileSync(file));
  if (!("glyphsForString" in font)) {
    throw new Error(`Expected one font in ${file}, got a collection`);
  }
  return font;
}

const inter = {
  regular: loadInter(400, "normal"),
  bold: loadInter(700, "normal"),
  italic: loadInter(400, "italic"),
  boldItalic: loadInter(700, "italic"),
};

/**
 * Measures labels in Inter, the font the diagrams are drawn in (see
 * `--pele-font`). Pele's default measurer uses a width table for a generic
 * sans-serif, which is narrower than Inter, so labels overflowed their boxes.
 * Kerning is ignored.
 */
const interMeasurer: TextMeasurer = {
  width(text, size, style) {
    if (style & MONO) return [...text].length * MONO_ADVANCE_EM * size;
    const bold = (style & BOLD) !== 0;
    const italic = (style & ITALIC) !== 0;
    const font = bold
      ? italic
        ? inter.boldItalic
        : inter.bold
      : italic
        ? inter.italic
        : inter.regular;
    let advance = 0;
    for (const glyph of font.glyphsForString(text)) {
      advance += glyph.advanceWidth;
    }
    return (advance / font.unitsPerEm) * size;
  },
};

function isMermaidCode(node: Readonly<Element>): boolean {
  const className = node.properties.className;
  return Array.isArray(className) && className.includes("language-mermaid");
}

export const mermaid = () =>
  defineHastPlugin({
    name: "mermaid",
    element: {
      filter: ["pre"],
      visit(node, ctx) {
        const code = node.children.find(
          (child): child is Element =>
            child.type === "element" && child.tagName === "code",
        );
        if (!code || !isMermaidCode(code)) return;

        // Every diagram on a page needs its own SVG id prefix.
        const index = ((ctx.data[COUNTER_KEY] as number | undefined) ?? 0) + 1;
        ctx.data[COUNTER_KEY] = index;

        let svg: string;
        try {
          ({ svg } = render(ctx.textContent(code), {
            idPrefix: `mermaid-${index}-`,
            measurer: interMeasurer,
          }));
        } catch (error) {
          if (error instanceof PeleError) {
            const file = ctx.fileURL?.pathname ?? "<unknown file>";
            throw new Error(
              `Mermaid diagram ${index} in ${file} (line ${error.line}, column ${error.column} of the diagram): ${error.message}`,
              { cause: error },
            );
          }
          throw error;
        }

        ctx.replaceNode(node, {
          type: "element",
          tagName: "div",
          properties: { className: ["mermaid-diagram"] },
          // MDX escapes `raw` nodes as text, so insert the SVG as elements.
          children: fromHtml(svg, { fragment: true, space: "svg" })
            .children as ElementContent[],
        });
      },
    },
  });
