import { test, expect } from "@playwright/test";
import { DevPage } from "../page-object-models/devPage.js";

const draculaBG = "rgb(17, 17, 17)"; // #282a36
const offWhite = "rgb(234, 234, 234)"; // #eaeaea
const white = "rgb(255, 255, 255)"; // #ffffff

test.describe("homepage", () => {
  test("has title", async ({ page }) => {
    await page.goto("/");

    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle(/Alan Norbauer/);
    await expect(page.locator("h1")).toHaveText("Alan Norbauer");
  });

  test("dark mode basics", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "dark" });
    const devPage = new DevPage(page);
    await devPage.goto();

    // respects color scheme
    await expect(page.locator(":root")).toHaveCSS(
      "background-color",
      draculaBG,
    );
    await expect(page.locator(":root")).toHaveCSS("color", offWhite);

    // allows override
    await devPage.toggleTheme();
    await expect(page.locator(":root")).toHaveCSS("background-color", white);
    await expect(page.locator(":root")).toHaveCSS("color", draculaBG);

    // override survives refresh
    await page.reload();
    await expect(page.locator(":root")).toHaveCSS("background-color", white);
    await expect(page.locator(":root")).toHaveCSS("color", draculaBG);
  });
});
