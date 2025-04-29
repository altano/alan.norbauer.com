import { expect, test } from "@playwright/test";
import { ArticleDevPage } from "../page-object-models/article.js";
import { DevPage } from "../page-object-models/devPage.js";

test.describe("responsiveness", () => {
  test("homepage", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveScreenshot();
  });

  test("project", async ({ page }) => {
    await page.goto("/projects/alanglow/");
    await expect(page).toHaveScreenshot();
  });

  test("tag w/ one article", async ({ page }) => {
    await page.goto("/tags/development-environments/");
    // if this starts failing because we have more than one article for this
    // tag, replace it with another tag we only have one of
    await expect(page.locator(`main > ul > li`)).toHaveCount(1);
    await expect(page).toHaveScreenshot();
  });

  test("tag w/ multiple articles", async ({ page }) => {
    await page.goto("/tags/javascript/");
    await expect(page).toHaveScreenshot();
  });

  test("contact", async ({ page }) => {
    await page.goto("/contact/");
    await expect(page).toHaveScreenshot();
  });

  test("relay article", async ({ page }) => {
    const article = new ArticleDevPage(page, "relay");
    await article.toHaveScreenshot();
    await article.toHaveScreenshot("#shifting-goals"); // table
    await article.toHaveScreenshot("#an-example-relay-component"); // code
    await article.toHaveScreenshot(
      "#benefit-3-your-components-are-easier-to-reason-about",
    ); // blockquote
    await article.toHaveScreenshot("#faq"); // question/answer components
    await article.toHaveScreenshot("#footnote-label");
  });

  test("browser debugging article", async ({ page }) => {
    const article = new ArticleDevPage(page, "browser-debugging");
    await article.toHaveScreenshot();
    await article.toHaveScreenshot("#never-pause-here"); // browser logo + images
    await article.toHaveScreenshot("#tracing-callstacks"); // h4
  });

  test("devbox article", async ({ page }) => {
    const article = new ArticleDevPage(page, "devbox");
    await article.toHaveScreenshot();
  });

  test("astro size article", async ({ page }) => {
    const article = new ArticleDevPage(page, "astro-size");
    await article.toHaveScreenshot();
  });

  test("404 page", async ({ page }) => {
    const devPage = new DevPage(page);
    await devPage.goto404();
    await expect(page).toHaveScreenshot();
  });
});
