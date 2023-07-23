import { z } from "zod";

export const Author = z.object({
  name: z.string(),
  url: z.string(),
});
