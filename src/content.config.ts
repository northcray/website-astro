import { defineCollection, z } from "astro:content";

import { glob } from "astro/loaders";

const newsmail = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/data/newsmail" }),
  schema: z.object({
    // title: z.string(),
  }),
});

export const collections = { newsmail };
