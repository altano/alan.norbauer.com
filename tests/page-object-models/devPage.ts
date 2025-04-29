import { type Locator, type Page } from "@playwright/test";
import { expect } from "../fixtures/fixtures.js";

export class DevPage {
  readonly themeSwitcher: Locator;

  constructor(public page: Page) {
    this.themeSwitcher = page.getByTestId("theme-switcher");
  }

  async toggleTheme() {
    const oldTheme = await this.getTheme();
    await this.themeSwitcher.click();
    if (oldTheme == null) {
      await expect(this.page.locator(":root")).toHaveTheme();
    } else {
      await expect(this.page.locator(":root")).not.toHaveTheme(oldTheme);
    }
  }

  async getTheme(): Promise<string | null> {
    return this.page.locator(":root").getAttribute("data-theme");
  }

  async goto(url: string = ""): ReturnType<typeof this.page.goto> {
    return this.page.goto(url);
  }

  async goto404(): ReturnType<typeof this.page.goto> {
    const result = await this.goto("/not-a-real-route");
    await expect(
      this.page.getByRole("heading", { name: "Nothing exists here." }),
    ).toBeVisible();
    return result;
  }

  async assertNotXScrollable(): Promise<void> {
    await expect(this.page.locator("html")).not.toHaveHorizontalScrollbar();
  }

  async assertNotYScrollable(): Promise<void> {
    await expect(this.page.locator("html")).not.toHaveVerticalScrollbar();
  }
}
