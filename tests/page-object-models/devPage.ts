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

  /**
   * Wait for every image intersecting the viewport to finish loading and
   * decoding before a screenshot is taken.
   *
   * Astro renders markdown images with `loading="lazy"` and `decoding="async"`
   * (and reserves layout with explicit width/height, so nothing shifts). That
   * means a screenshot can win the race against the async decode and capture a
   * blank box where the image should be — the source of our snapshot
   * flakiness. `img.decode()` resolves only once the pixels are ready to paint,
   * making the capture deterministic.
   */
  async waitForVisibleImagesDecoded(): Promise<void> {
    const decodeVisibleImages = () =>
      this.page.evaluate(async () => {
        const inViewport = Array.from(document.images).filter((img) => {
          const r = img.getBoundingClientRect();
          return (
            r.width > 0 &&
            r.height > 0 &&
            r.bottom > 0 &&
            r.right > 0 &&
            r.top < window.innerHeight &&
            r.left < window.innerWidth
          );
        });
        await Promise.all(
          // A broken/undecodable image rejects; let the screenshot assertion be
          // what surfaces that, not this wait.
          inViewport.map((img) => img.decode().catch(() => {})),
        );
      });

    try {
      await decodeVisibleImages();
    } catch (e) {
      // Astro's dev server (Vite) can force a full page reload on first visit
      // to optimize dependencies, which destroys the execution context
      // mid-evaluate. The production preview build used in CI doesn't do this.
      // Wait for the reload to settle and try once more.
      if (
        e instanceof Error &&
        /Execution context was destroyed/.test(e.message)
      ) {
        await this.page.waitForLoadState("load");
        await decodeVisibleImages();
      } else {
        throw e;
      }
    }
  }

  async assertNotXScrollable(): Promise<void> {
    await expect(this.page.locator("html")).not.toHaveHorizontalScrollbar();
  }

  async assertNotYScrollable(): Promise<void> {
    await expect(this.page.locator("html")).not.toHaveVerticalScrollbar();
  }
}
