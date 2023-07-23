import type { StyledComponent } from "@styled-system/types/jsx";

export type StyledRecipeVariantProps<C> = C extends StyledComponent<
  any,
  infer P
>
  ? P
  : never;
