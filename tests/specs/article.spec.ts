import { test, expect } from "../fixtures/fixtures.js";
import { ArticleDevPage } from "../page-object-models/article.js";
import { DevPage } from "../page-object-models/devPage.js";

test.describe("article", () => {
  test("reachable w/ multiple URLs", async ({ page }) => {
    const article = new ArticleDevPage(page, "relay");
    await page.goto("/articles/relay-style-graphql");
    await expect(article.h1).toBeVisible();
    await page.goto("/articles/relay-style-graphql/");
    await expect(article.h1).toBeVisible();
    await page.goto("/articles/relay-style-graphql/index.html");
    await expect(article.h1).toBeVisible();
  });

  test("has one title", async ({ page }) => {
    const article = new ArticleDevPage(page, "relay");
    await article.goto();
    await expect(page).toHaveTitle(`${article.heading} | Alan Norbauer`);
    await expect(article.h1).toHaveCount(1);
    await expect(article.h1).toHaveText(article.heading);
  });

  test("relay article has no scrollbars", async ({ page }) => {
    const article = new ArticleDevPage(page, "relay");
    await article.goto();
    await article.assertNotXScrollable();
  });

  test("devbox article has no scrollbars", async ({ page }) => {
    const article = new ArticleDevPage(page, "devbox");
    await article.goto();
    await article.assertNotXScrollable();
  });

  /* has very wide <table>s */
  test("astro size article has no scrollbars", async ({ page }) => {
    const article = new ArticleDevPage(page, "astro-size");
    await article.goto();
    await article.assertNotXScrollable();
  });

  test("tag page has no scrollbars", async ({ page }) => {
    const devPage = new DevPage(page);
    await devPage.goto("/tags/development-environments/");
    await devPage.assertNotXScrollable();

    // This is a really short page. If we have a reasonably sized device, it
    // should NOT have a vertical scrollbar
    const viewportHeight = page.viewportSize()?.height;
    if (viewportHeight && viewportHeight >= 700) {
      await devPage.assertNotYScrollable();
    }
  });
});
