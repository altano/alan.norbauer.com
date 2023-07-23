import pkg from "../../../package.json";
import { z } from "zod";
import { Author } from "./author";

const defaultAuthor: z.infer<typeof Author> = {
  name: pkg.author.name,
  url: pkg.author.url,
};

export const ArticleFrontmatter = z.object({
  title: z.string().min(5),
  description: z.string().min(5),
  series: z.undefined().or(z.string()),
  date_created: z.coerce.date(),
  date_updated: z.undefined().or(z.coerce.date()),
  draft: z.coerce.boolean(),
  authors: z.array(Author).default([defaultAuthor]),
  tags: z.string().array().default([]),
});
