import { test, expect } from "@playwright/test";
import { DevPage } from "../page-object-models/devPage.js";

test.describe("homepage", () => {
  test("has title", async ({ page }) => {
    await page.goto("/contact");

    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle("Contact | Alan Norbauer");
    await expect(
      page.getByRole("heading", { name: "Alan on the Internet" }),
    ).toBeVisible();
  });

  test("has no scrollbars", async ({ page }) => {
    const devPage = new DevPage(page);
    await devPage.goto("/contact");
    await devPage.assertNotXScrollable();
  });
});
