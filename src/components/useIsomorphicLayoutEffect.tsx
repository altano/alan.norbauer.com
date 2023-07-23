import { useEffect, useLayoutEffect } from "react";

// Make sure this is added to the "additionalHooks" option of the
// "react-hooks/exhaustive-deps" eslint rule
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export default useIsomorphicLayoutEffect;
