import { test, expect } from "@playwright/test";

test.describe("code viewer", () => {
  test("loads and switches files", async ({ page }) => {
    await page.goto("/articles/ajax-polling#demo-and-source-code");

    const viewer = page.locator(".code-viewer-container");
    const indexPhpButton = viewer.getByRole("button", { name: "index.php" });
    const ajaxPollerButton = viewer.getByRole("button", {
      name: "ajax_poller.js",
    });
    const charGenButton = viewer.getByRole("button", {
      name: "characterGenerator.php",
    });

    // Verify index.php content loaded (check for unique content from that file)
    await expect(viewer.getByText("XMLHttpRequest Polling")).toBeVisible();

    // Verify syntax highlighting exists (different tokens should have different colors)
    const metaColor = await viewer
      .getByText("meta")
      .first()
      .evaluate((el) => window.getComputedStyle(el).color);
    const contentTypeColor = await viewer
      .getByText("content-type")
      .first()
      .evaluate((el) => window.getComputedStyle(el).color);
    expect(metaColor).not.toEqual(contentTypeColor);

    // Verify initial active states
    await expect(indexPhpButton).toHaveAttribute("data-active", "true");
    await expect(ajaxPollerButton).toHaveAttribute("data-active", "false");
    await expect(charGenButton).toHaveAttribute("data-active", "false");

    // Click ajax_poller.js tab
    await ajaxPollerButton.click();

    // Verify active states changed
    await expect(indexPhpButton).toHaveAttribute("data-active", "false");
    await expect(ajaxPollerButton).toHaveAttribute("data-active", "true");
    await expect(charGenButton).toHaveAttribute("data-active", "false");

    // Verify content switched to ajax_poller.js (check for unique content)
    await expect(viewer.getByText("var timeoutTimer;")).toBeVisible();
  });
});
