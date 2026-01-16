import { defineCollection, reference, z } from "astro:content";

const social = z.object({
  name: z.string(),
  handle: z.string(),
  link: z.string().url(),
});

const authors = defineCollection({
  type: "data",
  schema: z.object({
    name: z.string(),
    firstName: z.string(), //.lowercase(),
    url: z.string(),
    socials: z
      .object({
        bluesky: social,
        email: social,
        facebook: social,
        github: social,
        hackernews: social,
        instagram: social,
        lobsters: social,
        mastodon: social,
        reddit: social,
        rss: social,
        threads: social,
        twitter: social,
      })
      .required(),
  }),
});

const articleSeries = defineCollection({
  type: "data",
  schema: z.object({
    name: z.string(),
  }),
});

const articles = defineCollection({
  type: "content",
  schema: z.object({
    authors: reference("authors").array().optional().default(["alan"]),
    date_created: z.coerce.date(),
    date_updated: z.undefined().or(z.coerce.date()),
    description: z.string().min(5),
    draft: z.coerce.boolean(),
    series: z.undefined().or(reference("articleSeries")),
    tags: z.string().array().default([]),
    title: z.string().min(5),
  }),
});

export const collections = { authors, articles, articleSeries };
