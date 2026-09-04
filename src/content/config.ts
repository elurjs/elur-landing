import { defineCollection } from "@elurjs/kit/content";
import { z } from "zod";

export const collections = {
  docs: defineCollection({
    schema: z.object({
      title: z.string(),
      description: z.string(),
      section: z.string(),
      order: z.number(),
      draft: z.boolean().optional(),
    }),
  }),
  examples: defineCollection({
    schema: z.object({
      title: z.string(),
      description: z.string(),
      category: z.string(),
      order: z.number(),
      code: z.string().optional(),
      difficulty: z.string().optional(),
      featured: z.boolean().optional(),
    }),
  }),
  tutorial: defineCollection({
    schema: z.object({
      title: z.string(),
      description: z.string(),
      section: z.string(),
      order: z.number(),
      starterCode: z.string(),
      solutionCode: z.string(),
      hint: z.string(),
    }),
  }),
};
