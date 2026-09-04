import type { PageDataLoad } from "@elurjs/kit";
import { getTutorialNav } from "../lib/tutorial-nav";

export const load: PageDataLoad = async ({ params }) => {
  const tutorialNav = await getTutorialNav();
  const slugParts = (params as Record<string, unknown>).slug;
  const currentSlug = Array.isArray(slugParts)
    ? slugParts.join("/")
    : (slugParts as string) || "";
  return { tutorialNav, currentSlug };
};
