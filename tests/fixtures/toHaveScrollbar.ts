/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-base-to-string */
import {
  test,
  type ExpectMatcherState,
  type Locator,
  expect as baseExpect,
} from "@playwright/test";
import { isExpectError, type ExpectError } from "./types.js";

export async function toHaveScrollbar(
  this: ExpectMatcherState,
  locator: Locator,
  type: "horizontal" | "vertical",
) {
  const assertionName = "toHaveHorizontalScrollbar";
  let pass: boolean;
  let matcherResult: ExpectError["matcherResult"] | null = null;

  try {
    const isScrollable = await test.step(
      `Evaluating element scroll`,
      async () => {
        const [scrollDimension, clientDimension] = await (type === "horizontal"
          ? locator.evaluate(($el) => [$el.scrollWidth, $el.clientWidth])
          : locator.evaluate(($el) => [$el.scrollHeight, $el.clientHeight]));
        const isScrollable = scrollDimension > clientDimension;
        const dimension = type === "horizontal" ? "Width" : "Height";
        test.info().annotations.push({
          type: "custom",
          description: `[toHaveScrollbar(${type})] scroll${dimension}=${scrollDimension} > client${dimension}=${clientDimension} => ${isScrollable ? "has scrollbar" : "does NOT have scrollbar"}`,
        });
        return isScrollable;
      },
      { box: false },
    );

    const shouldBeScrollable = !this.isNot;
    baseExpect(isScrollable).toStrictEqual(shouldBeScrollable);
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
        `Expected: ${this.utils.printExpected(false)}\n` +
        (matcherResult
          ? `Received: ${this.utils.printReceived(matcherResult.actual)}`
          : "")
    : () =>
        this.utils.matcherHint(assertionName, undefined, undefined, {
          isNot: this.isNot,
        }) +
        "\n\n" +
        `Locator: ${locator}\n` +
        `Expected: ${this.utils.printExpected(true)}\n` +
        (matcherResult
          ? `Received: ${this.utils.printReceived(matcherResult.actual)}`
          : "");

  return {
    message,
    pass,
    name: assertionName,
    expected: true,
    actual: matcherResult?.actual,
  };
}
