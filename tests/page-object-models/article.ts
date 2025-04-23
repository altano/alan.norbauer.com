import { type Locator, type Page } from "@playwright/test";
import { DevPage } from "./devPage.js";

type Shortcut = "relay" | "devbox" | "satori";

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
    }
  }

  override async goto(): ReturnType<typeof this.page.goto> {
    return await this.page.goto(`/articles/${this.slug}`);
  }
}
