type MatcherResult<E, A> = {
  name: string;
  expected?: E;
  message: () => string;
  pass: boolean;
  actual?: A;
  log?: string[];
  timeout?: number;
  suggestedRebaseline?: string;
};

type MatcherResultProperty = Omit<
  MatcherResult<unknown, unknown>,
  "message"
> & {
  message: string;
};

// Typing this idiot: https://github.com/microsoft/playwright/blob/1924b51d3f536a51cc2386c119ab922250dbf783/packages/playwright/src/matchers/matcherHint.ts#L54
export declare class ExpectError extends Error {
  matcherResult: MatcherResultProperty;
}

export function isExpectError(e: unknown): e is ExpectError {
  return e instanceof ExpectError;
}
