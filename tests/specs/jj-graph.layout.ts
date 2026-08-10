import { expect, test } from "../fixtures/fixtures.js";

/**
 * The before/after diagrams rearrange themselves at three sizes: the halves
 * side by side with the command between them, side by side with the command
 * lifted above them, or stacked with the command in between.
 *
 * Which one applies is a question about the *figure*, not the window — the
 * table of contents appears at wide viewports and makes the article column
 * narrower, not wider, so a 1033px viewport has less room for a diagram than
 * an 800px one. Getting that wrong strands the command beside a half-height
 * column, which is what most of these widths caught.
 *
 * Runs on one browser only (see the `layout` project): these assert layout
 * arithmetic, not per-engine rendering.
 */

type LayoutMode = "row+middle" | "row+top" | "stack+between" | "broken";

const WIDTHS: { width: number; expected: LayoutMode; why: string }[] = [
  { width: 320, expected: "stack+between", why: "narrowest supported viewport" },
  {
    width: 375,
    expected: "stack+between",
    why: "iPhone 13 mini — the diagram must not scale its text down to fit",
  },
  { width: 453, expected: "stack+between", why: "comfortably stacked" },
  {
    width: 601,
    expected: "row+top",
    why: "once stacked the halves while leaving the command on top",
  },
  { width: 627, expected: "row+top", why: "just above the side-by-side threshold" },
  { width: 803, expected: "row+middle", why: "roomy enough for a single row" },
  {
    width: 1033,
    expected: "row+top",
    // The clearest demonstration that width is the wrong signal: this is a
    // *wider* window than the 803px case above, yet the column is narrower,
    // so it gets the more compact arrangement.
    why: "the table of contents appears here, narrowing the column below what 803px gets",
  },
  { width: 1280, expected: "row+middle", why: "widest the article column gets" },
];

/** Classifies each diagram by where its command sits relative to its halves. */
async function layoutModes(page: import("@playwright/test").Page) {
  return await page.evaluate(() =>
    [...document.querySelectorAll(".jj-graph-pair")].map((pair) => {
      const [before, after] = [
        ...pair.querySelectorAll("svg.jj-graph-svg"),
      ].map((svg) => svg.getBoundingClientRect());
      const command = pair.querySelector(".jj-op")!.getBoundingClientRect();
      if (before === undefined || after === undefined) return "broken";

      // Side by side means horizontally disjoint *and* vertically overlapping.
      // Comparing `top` alone would misread the bottom-aligned halves of a
      // pair whose graphs are different heights.
      const sideBySide =
        before.right <= after.left + 1 &&
        before.bottom > after.top &&
        after.bottom > before.top;

      if (sideBySide) {
        if (command.bottom <= Math.min(before.top, after.top) + 1) {
          return "row+top";
        }
        return command.left >= before.right - 1 &&
          command.right <= after.left + 1
          ? "row+middle"
          : "broken";
      }

      return before.bottom <= after.top + 1 &&
        command.top >= before.bottom - 1 &&
        command.bottom <= after.top + 1
        ? "stack+between"
        : "broken";
    }),
  );
}

test.describe("jj graph before/after layout", () => {
  for (const { width, expected, why } of WIDTHS) {
    test(`${String(width)}px - ${why}`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/articles/stacks-in-jujutsu/");

      const diagrams = page.locator("figure.jj-graph:has(.jj-graph-pair)");
      const count = await diagrams.count();
      expect(count).toBeGreaterThan(0);

      // The arrangement itself, asserted separately from the pixels so a
      // regression says *what* broke rather than just that something moved.
      // Every diagram shares a container width, so every one should agree —
      // including the one whose command is long enough to have blown the
      // single-row budget before it was capped.
      expect(await layoutModes(page)).toEqual(
        Array.from({ length: count }, () => expected),
      );

      // A diagram may never push the page sideways.
      await expect(page.locator("html")).not.toHaveHorizontalScrollbar();

      for (const [index, diagram] of (await diagrams.all()).entries()) {
        await diagram.scrollIntoViewIfNeeded();
        await expect(diagram).toHaveScreenshot(
          `jj-pair-${String(index)}-${String(width)}.png`,
          { maxDiffPixelRatio: 0.01 },
        );
      }
    });
  }
});
