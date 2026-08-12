import { expect, scrollToTop, test } from "../fixtures/fixtures.js";

/**
 * TOML is themed by hand in both schemes, and the two halves are easy to
 * regress independently:
 *
 * - Light is a customized Firefox Light (`src/styles/code-themes/`).
 * - Dracula deliberately gives table headers and keys the same cyan, so
 *   `ec.config.mjs` pushes a rule that splits them — a header reads as a
 *   header, and a key is green in *both* themes rather than meaning one thing
 *   in light and another in dark.
 *
 * Losing that split is invisible in a diff and only shows up as two tokens
 * quietly sharing a color, so the colors are asserted by name here and the
 * screenshot is left to catch everything else. Asserting them separately from
 * the pixels means a regression says *which* token lost its color rather than
 * just that something moved.
 *
 * Only bare keys (`definition = ...`) and bare dotted headers
 * (`[aliases.bottom]`) are covered, which is all the site actually uses.
 */

/** The intended palette. Update deliberately if the themes change. */
const EXPECTED = {
  light: { header: "rgb(128, 0, 215)", key: "rgb(4, 119, 0)" },
  dark: { header: "rgb(139, 233, 253)", key: "rgb(80, 250, 123)" },
} as const;

test.describe("toml syntax highlighting", () => {
  for (const colorScheme of ["light", "dark"] as const) {
    test(`table headers stay distinct from keys - ${colorScheme} mode`, async ({
      page,
    }) => {
      await page.emulateMedia({ colorScheme });
      await page.goto("/articles/stacks-in-jujutsu/");

      // The distilled "Full configuration" block: one canonical figure in its
      // section, so this does not shift when surrounding prose or examples do.
      // Its headers and keys are all bare, keeping this meaningful regardless
      // of how quoted keys are handled.
      const figure = page.locator(
        "section:has(> h2#full-configuration) figure.frame",
      );
      await expect(figure).toBeVisible();
      await scrollToTop(figure);

      const colors = await figure.evaluate((fig) => {
        const spans = [...fig.querySelectorAll("span")];
        const colorOf = (text: string) => {
          const el = spans.find((s) => s.textContent === text);
          return el ? getComputedStyle(el).color : null;
        };
        return {
          header: colorOf("aliases"),
          headerTail: colorOf("bottom"),
          key: colorOf("definition"),
          otherKey: colorOf("doc"),
        };
      });

      const want = EXPECTED[colorScheme];
      // The regression that started all this: header and key sharing a color.
      expect(colors.header).not.toEqual(colors.key);
      expect(colors).toEqual({
        header: want.header,
        headerTail: want.header,
        key: want.key,
        otherKey: want.key,
      });

      // The block runs ~90 lines. Capturing the first 600px is enough to
      // show a table header and both keys asserted above, without carrying
      // pages of repetition that would only churn.
      const box = await figure.boundingBox();
      if (!box) throw new Error("expected the TOML figure to have a box");
      await expect(page).toHaveScreenshot(`toml-${colorScheme}.png`, {
        clip: { ...box, height: Math.min(box.height, 600) },
      });
    });
  }
});
