import type { Locator } from "@playwright/test";

/**
 * Scrolls a locator to the top of the viewport, mimicking anchor link behavior.
 * Unlike `scrollIntoViewIfNeeded()`, this positions the element at the top.
 *
 * In headless WebKit, a code block that scrolls sideways reports a height 16px
 * short of its contents until the first screenshot is taken. The devbox article
 * has four such blocks above its "visually inclined" paragraph, so a scroll made
 * before any screenshot landed 64px short once the screenshot corrected their
 * heights. Neither a forced reflow nor waiting for animation frames corrects
 * them. (Unproven hypothesis: WebKit adds the horizontal scrollbar's height to
 * the block's container only at first paint.) Taking a throwaway screenshot
 * first means the scroll is measured against the layout the real one will see.
 */
export async function scrollToTop(locator: Locator): Promise<void> {
  await locator.page().screenshot();
  await locator.evaluate((el) =>
    el.scrollIntoView({ block: "start", behavior: "instant" }),
  );
}
