import { test, expect } from "@playwright/test";
import { DevPage } from "../page-object-models/devPage.js";

test.describe("404 error page", () => {
  test("has title", async ({ page }) => {
    const devPage = new DevPage(page);
    await devPage.goto404();
    await expect(page).toHaveTitle("Nothing here | Alan Norbauer");
  });

  test("has no scrollbars", async ({ page }) => {
    const devPage = new DevPage(page);
    await devPage.goto404();
    await devPage.assertNotXScrollable();
    await devPage.assertNotYScrollable();
  });
});
