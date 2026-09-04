import { getCollection, getEntry, type ContentEntry } from "@elurjs/kit/content";

export interface DocMeta {
  title: string;
  description: string;
  section: string;
  order: number;
  slug: string;
  draft?: boolean;
}

export interface NavSection {
  title: string;
  items: DocMeta[];
}

const SECTION_ORDER = [
  "Getting Started",
  "Core",
  "State",
  "Advanced",
  "Ecosystem",
  "Elur Kit",
  "Elur Query",
  "Elur Ionic",
  "Elur Auth",
  "Elur i18n",
  "Reference",
];

export async function getDocsNav(): Promise<NavSection[]> {
  const entries = await getCollection<DocMeta>("docs");
  const docs = entries
    .filter((e) => !e.data.draft)
    .map((e) => ({
      title: e.data.title,
      description: e.data.description,
      section: e.data.section,
      order: e.data.order,
      slug: e.slug,
    }));

  const sectionMap = new Map<string, DocMeta[]>();
  for (const doc of docs) {
    const arr = sectionMap.get(doc.section) ?? [];
    arr.push(doc);
    sectionMap.set(doc.section, arr);
  }

  const sections: NavSection[] = [];
  for (const section of SECTION_ORDER) {
    const items = sectionMap.get(section);
    if (!items || items.length === 0) continue;
    items.sort((a, b) => a.order - b.order);
    sections.push({ title: section, items });
  }

  for (const [section, items] of sectionMap) {
    if (SECTION_ORDER.includes(section)) continue;
    items.sort((a, b) => a.order - b.order);
    sections.push({ title: section, items });
  }

  return sections;
}

export async function getPrevNext(
  slug: string,
): Promise<{ prev?: DocMeta; next?: DocMeta }> {
  const sections = await getDocsNav();
  const flat: DocMeta[] = [];
  for (const s of sections) flat.push(...s.items);

  const idx = flat.findIndex((d) => d.slug === slug);
  if (idx === -1) return {};

  return {
    prev: idx > 0 ? flat[idx - 1] : undefined,
    next: idx < flat.length - 1 ? flat[idx + 1] : undefined,
  };
}

export interface ExampleMeta {
  title: string;
  description: string;
  category: string;
  order: number;
  slug: string;
  difficulty?: string;
  featured?: boolean;
  code?: string;
}

export interface ExampleEntry extends ContentEntry<ExampleMeta> { }

export async function getExamples(): Promise<ExampleMeta[]> {
  const entries = await getCollection<ExampleMeta>("examples");
  return entries
    .map((e) => ({
      title: e.data.title,
      description: e.data.description,
      category: e.data.category,
      order: e.data.order,
      slug: e.slug,
      difficulty: e.data.difficulty,
      featured: e.data.featured,
      code: e.data.code,
    }))
    .sort((a, b) => a.order - b.order);
}

export async function getExampleBySlug(
  slug: string,
): Promise<ExampleEntry | undefined> {
  return await getEntry<ExampleMeta>("examples", slug);
}
