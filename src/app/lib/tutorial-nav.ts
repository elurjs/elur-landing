import { getCollection, getEntry, type ContentEntry } from "@elurjs/kit/content";

export interface TutorialData {
  title: string;
  description: string;
  section: string;
  order: number;
  starterCode: string;
  solutionCode: string;
  hint: string;
}

export type TutorialEntry = ContentEntry<TutorialData>;

export interface TutorialMeta {
  title: string;
  description: string;
  section: string;
  order: number;
  slug: string;
}

export interface TutorialSection {
  title: string;
  items: TutorialMeta[];
}

const SECTION_ORDER = ["Basics", "State", "Components", "Advanced"];

export async function getTutorialNav(): Promise<TutorialSection[]> {
  const entries = await getCollection<TutorialData>("tutorial");
  const lessons = entries.map((e) => ({
    title: e.data.title,
    description: e.data.description,
    section: e.data.section,
    order: e.data.order,
    slug: e.slug,
  }));

  const sections: TutorialSection[] = [];
  const sectionMap = new Map<string, TutorialMeta[]>();

  for (const lesson of lessons) {
    const arr = sectionMap.get(lesson.section) ?? [];
    arr.push(lesson);
    sectionMap.set(lesson.section, arr);
  }

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

export async function getTutorialBySlug(
  slug: string,
): Promise<TutorialEntry | undefined> {
  return await getEntry<TutorialData>("tutorial", slug);
}

export async function getTutorialPrevNext(
  slug: string,
): Promise<{ prev?: TutorialMeta; next?: TutorialMeta }> {
  const sections = await getTutorialNav();
  const flat: TutorialMeta[] = [];
  for (const s of sections) flat.push(...s.items);

  const idx = flat.findIndex((d) => d.slug === slug);
  if (idx === -1) return {};

  return {
    prev: idx > 0 ? flat[idx - 1] : undefined,
    next: idx < flat.length - 1 ? flat[idx + 1] : undefined,
  };
}
