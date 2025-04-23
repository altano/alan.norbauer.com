import { test, expect } from "../fixtures.js";
import { ArticleDevPage } from "../page-object-models/article.js";

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
});
