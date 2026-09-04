import type { PageDataLoad } from "@elurjs/kit";
import { getExamples, type ExampleMeta } from "../lib/docs-nav";
import { extractCodeBlock } from "../lib/markdown";
import { getEntry } from "@elurjs/kit/content";

export interface ExamplesIndexData {
  examples: Array<ExampleMeta & { previewCode: string }>;
  categories: string[];
}

export const load: PageDataLoad = async (): Promise<ExamplesIndexData> => {
  const allExamples = await getExamples();

  // For each example, extract the code from the markdown body
  const examplesWithCode = await Promise.all(
    allExamples.map(async (ex) => {
      const entry = await getEntry<ExampleMeta>("examples", ex.slug);
      const previewCode = entry ? extractCodeBlock(entry.body) : "";
      return { ...ex, previewCode };
    }),
  );

  const categories = [...new Set(allExamples.map((e) => e.category))].sort();

  return { examples: examplesWithCode, categories };
};
