import { expect as baseExpect } from "@playwright/test";
import type { Locator } from "@playwright/test";

export { test } from "@playwright/test";

export const expect = baseExpect.extend({
  async toHaveTheme(
    locator: Locator,
    expected?: string,
    options?: { timeout?: number },
  ) {
    const assertionName = "toHaveTheme";
    let pass: boolean;
    let matcherResult: any;

    try {
      const expectation = this.isNot
        ? baseExpect(locator).not
        : baseExpect(locator);
      if (expected == null) {
        await expectation.toHaveAttribute("data-theme", options);
      } else {
        await expectation.toHaveAttribute("data-theme", expected, options);
      }
      pass = true;
    } catch (e: any) {
      matcherResult = e.matcherResult;
      pass = false;
    }

    if (this.isNot) {
      pass = !pass;
    }

    const message = pass
      ? () =>
          this.utils.matcherHint(assertionName, undefined, undefined, {
            isNot: this.isNot,
          }) +
          "\n\n" +
          `Locator: ${locator}\n` +
          `Expected: not ${this.utils.printExpected(expected)}\n` +
          (matcherResult
            ? `Received: ${this.utils.printReceived(matcherResult.actual)}`
            : "")
      : () =>
          this.utils.matcherHint(assertionName, undefined, undefined, {
            isNot: this.isNot,
          }) +
          "\n\n" +
          `Locator: ${locator}\n` +
          `Expected: ${this.utils.printExpected(expected)}\n` +
          (matcherResult
            ? `Received: ${this.utils.printReceived(matcherResult.actual)}`
            : "");

    return {
      message,
      pass,
      name: assertionName,
      expected,
      actual: matcherResult?.actual,
    };
  },
});
