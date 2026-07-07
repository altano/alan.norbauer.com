import { test, expect } from "../fixtures/fixtures.js";

/**
 * This protects against regressions in SVG rendering, such as global css
 * messing with fill, mermaid diagram rendering issues, or shadow box css
 * issues.
 *
 * This test is potentially only helpful in CI where we do a full build+preview
 * instead of just running the dev server.
 */
test.describe("svg rendering", () => {
  /**
   * Light mode captures the chart's natural colors; dark mode additionally
   * exercises the `filter: invert()` applied to invertible SVGs.
   */
  for (const colorScheme of ["light", "dark"] as const) {
    /**
     * The inline SVG charts in the "From Next.js to Astro" article rendered
     * with their fills stripped in the production build — missing
     * bars/title/legend and a black background — while the axis/grid lines
     * (stroke-only) still showed. See the chart under `#homepage-bytes`.
     */
    test(`homepage-bytes SVG chart keeps its fills - ${colorScheme} mode`, async ({
      page,
    }) => {
      await page.emulateMedia({ colorScheme });
      await page.goto("/articles/astro-vs-nextjs-page-size");

      // The first invertible chart on the page is the "Homepage Bytes" one.
      const chart = page.locator("svg[data-invertible]").first();
      await chart.scrollIntoViewIfNeeded();
      await expect(chart).toBeVisible();

      await expect(chart).toHaveScreenshot(
        `homepage-bytes-chart-${colorScheme}.png`,
        {
          // absorb antialiasing noise; the bug wipes out a huge fraction of
          // pixels so a small tolerance can't mask it.
          maxDiffPixelRatio: 0.01,
        },
      );
    });

    test(`mermaid diagrams - ${colorScheme} mode`, async ({ page }) => {
      await page.emulateMedia({ colorScheme });
      await page.goto("/articles/devbox-intro");

      // The first invertible diagram on the page is the "Homepage Bytes" one.
      const diagram = page
        .getByText("For the visually inclined:")
        .locator("xpath=following-sibling::div[1]");
      await diagram.scrollIntoViewIfNeeded();
      await expect(diagram).toBeVisible();

      await expect(diagram).toHaveScreenshot(
        `mermaid-diagram-${colorScheme}.png`,
        {
          // absorb antialiasing noise; the bug wipes out a huge fraction of
          // pixels so a small tolerance can't mask it.
          maxDiffPixelRatio: 0.01,
        },
      );
    });
  }
});
