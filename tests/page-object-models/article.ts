import { type Locator, type Page } from "@playwright/test";
import { DevPage } from "./devPage.js";
import { expect } from "../fixtures/fixtures.js";

type Shortcut =
  | "relay"
  | "devbox"
  | "satori"
  | "astro-size"
  | "browser-debugging";

export class ArticleDevPage extends DevPage {
  readonly heading: string;
  readonly slug: string;
  readonly h1: Locator;

  constructor(page: Page, shortcut: Shortcut) {
    super(page);
    this.slug = this.#shortcutToSlug(shortcut);
    this.heading = this.#shortcutToTitle(shortcut);
    this.h1 = page.getByRole("heading", {
      name: this.heading,
      exact: true,
    });
  }

  #shortcutToSlug(shortcut: Shortcut): string {
    switch (shortcut) {
      case "relay":
        return "relay-style-graphql";
      case "devbox":
        return "devbox-intro";
      case "satori":
        return "satori-fit-text";
      case "astro-size":
        return "astro-vs-nextjs-page-size";
      case "browser-debugging":
        return "browser-debugging-tricks";
    }
  }

  #shortcutToTitle(shortcut: Shortcut): string {
    switch (shortcut) {
      case "relay":
        return "Relay-style GraphQL";
      case "devbox":
        return "Upgrade your Development Environments with Devbox";
      case "satori":
        return "Fitting Text, Anywhere";
      case "astro-size":
        return "From Next.js to Astro: A Page Size Comparison";
      case "browser-debugging":
        return "67 Weird Debugging Tricks Your Browser Doesn't Want You to Know";
    }
  }

  override async goto(fragment?: string): ReturnType<typeof this.page.goto> {
    const result = await this.page.goto(
      `/articles/${this.slug}${fragment ?? ""}`,
    );

    if (fragment) {
      // const id = fragment.replace(/$#/, '');
      await expect(this.page.locator(fragment)).toBeInViewport();
    }

    return result;
  }

  async toHaveScreenshot(fragment?: string): Promise<void> {
    await this.goto(fragment);
    const screenshotPrefix = fragment
      ? `article--${this.slug}-${fragment}.png`
      : `article--${this.slug}.png`;
    await expect(this.page).toHaveScreenshot(screenshotPrefix, {
      // Mask out gifs which, because they are auto-playing, introduce flakiness
      mask: [this.page.locator(`img[src$=".gif"]`)],
    });
  }
}
