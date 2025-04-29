import { expect as baseExpect } from "@playwright/test";
import type { Locator } from "@playwright/test";
import { toHaveScrollbar } from "./toHaveScrollbar.js";
import { toHaveTheme } from "./toHaveTheme.js";

export { test } from "@playwright/test";

export const expect = baseExpect.extend({
  async toHaveTheme(
    locator: Locator,
    expected?: string,
    options?: { timeout?: number },
  ) {
    return await toHaveTheme.call(this, locator, expected, options);
  },
  async toHaveScrollbar(locator: Locator, type: "horizontal" | "vertical") {
    return await toHaveScrollbar.call(this, locator, type);
  },
  async toHaveHorizontalScrollbar(locator: Locator) {
    return await toHaveScrollbar.call(this, locator, "horizontal");
  },
  async toHaveVerticalScrollbar(locator: Locator) {
    return await toHaveScrollbar.call(this, locator, "vertical");
  },
});
