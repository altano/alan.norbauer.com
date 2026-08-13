import { expect, test } from "../fixtures/fixtures.js";
import type { Locator, Page } from "@playwright/test";

/**
 * The series navigation at the foot of an article has four states, decided by
 * where the article sits in its series:
 *
 * - only next        first in a series
 * - only previous    last in a series
 * - both             anywhere in the middle
 * - neither          not in a series at all
 *
 * The "find more writing" link is in all four; the `<hr>` above it only shows
 * up when there is at least one series link to separate it from.
 *
 * Only the `<nav>` is captured rather than the page, so these don't churn every
 * time the prose above them changes.
 */

/** First in its series: a next link, no previous. */
const SERIES_FIRST = "/articles/stacks-in-jujutsu/";
/** Last in its series: a previous link, no next. */
const SERIES_LAST = "/articles/github-stacks-with-jujutsu/";
/** In no series at all: neither link. */
const STANDALONE = "/articles/relay-style-graphql/";

function navigation(page: Page): Locator {
  return page.getByRole("navigation", { name: "More articles" });
}

/**
 * Assert which links the nav is made of, separately from the pixels, so a
 * regression says *which* link went missing rather than just that something
 * moved.
 */
async function expectLinks(
  nav: Locator,
  { previous, next }: { previous: boolean; next: boolean },
): Promise<void> {
  await expect(nav.locator('a[rel="prev"]')).toHaveCount(previous ? 1 : 0);
  await expect(nav.locator('a[rel="next"]')).toHaveCount(next ? 1 : 0);
  // Always present, whatever the series links do.
  await expect(nav.locator('a[href="/#writing"]')).toHaveCount(1);
  // The divider only earns its place when it has something to divide.
  await expect(nav.locator("hr")).toHaveCount(previous || next ? 1 : 0);
}

test.describe("article navigation", () => {
  test("only next", async ({ page }) => {
    await page.goto(SERIES_FIRST);
    const nav = navigation(page);
    await expectLinks(nav, { previous: false, next: true });
    await expect(nav).toHaveScreenshot("article-nav-only-next.png");
  });

  test("only previous", async ({ page }) => {
    await page.goto(SERIES_LAST);
    const nav = navigation(page);
    await expectLinks(nav, { previous: true, next: false });
    await expect(nav).toHaveScreenshot("article-nav-only-previous.png");
  });

  /**
   * No article has both neighbors yet: each series is two articles long, so
   * every one of them is either the first or the last. Rather than invent
   * markup by hand, this takes the next link the *first* article renders and
   * splices it into the nav of the *last* one — the two are the same series, so
   * the result is exactly the nav a third, middle article would produce, built
   * out of real component output.
   *
   * Replace this with a plain `goto` of a middle article the moment a series
   * grows to three.
   */
  test("previous and next", async ({ page }) => {
    await page.goto(SERIES_FIRST);
    const nextLink = await navigation(page)
      .locator('a[rel="next"]')
      .evaluate((el) => el.outerHTML);

    await page.goto(SERIES_LAST);
    const nav = navigation(page);
    // Astro's scoped styles ride along on the markup's `data-astro-cid-*`
    // attribute, so the spliced link is styled like any other.
    await nav.locator('a[rel="prev"]').evaluate((el, html) => {
      el.insertAdjacentHTML("afterend", html);
    }, nextLink);

    await expectLinks(nav, { previous: true, next: true });
    await expect(nav).toHaveScreenshot("article-nav-previous-and-next.png");
  });

  test("neither", async ({ page }) => {
    await page.goto(STANDALONE);
    const nav = navigation(page);
    await expectLinks(nav, { previous: false, next: false });
    await expect(nav).toHaveScreenshot("article-nav-neither.png");
  });
});
