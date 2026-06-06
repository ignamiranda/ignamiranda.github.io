import { defineCollection, z } from "astro:content";

const notes = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    date: z
      .union([z.string(), z.date()])
      .transform((v) => (typeof v === "string" ? v : v.toISOString().slice(0, 10)))
      .optional(),
    tags: z.array(z.string()).optional(),
    draft: z.boolean().optional(),
    layout: z.string().optional(),
  }),
});

export const collections = { notes };
