import type { Locator } from "@playwright/test";

/**
 * Scrolls a locator to the top of the viewport, mimicking anchor link behavior.
 * Unlike `scrollIntoViewIfNeeded()`, this positions the element at the top.
 */
export async function scrollToTop(locator: Locator): Promise<void> {
  await locator.evaluate((el) =>
    el.scrollIntoView({ block: "start", behavior: "instant" }),
  );
}
