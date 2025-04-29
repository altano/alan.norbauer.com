/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-base-to-string */
import {
  type ExpectMatcherState,
  type Locator,
  expect as baseExpect,
} from "@playwright/test";
import { type ExpectError, isExpectError } from "./types.js";

export async function toHaveTheme(
  this: ExpectMatcherState,
  locator: Locator,
  expected?: string,
  options?: { timeout?: number },
) {
  const assertionName = "toHaveTheme";
  let pass: boolean;
  let matcherResult: ExpectError["matcherResult"] | null = null;

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
  } catch (e: unknown) {
    pass = false;
    if (isExpectError(e)) {
      matcherResult = e.matcherResult;
    } else {
      console.error(e);
    }
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
}
