import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (m) => {
    if (m.type() !== "error") return;
    const text = m.text();
    if (/Failed to load resource: the server responded with a status of (4\d\d)/.test(text)) return;
    errors.push(text);
  });
  page.on("pageerror", (err) => errors.push(String(err)));
  (page as unknown as { __errors?: string[] }).__errors = errors;
});

test.afterEach(async ({ page }) => {
  const errors = (page as unknown as { __errors?: string[] }).__errors ?? [];
  expect(errors, `console/page errors: ${errors.join(" | ")}`).toEqual([]);
});

test("home renders SSG content", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("h1").first()).toContainText("Elur");
  await expect(page.locator("h1").first()).toContainText("reactive JavaScript UIs");
  await expect(page.locator("section.hero").first()).toBeVisible();
  // Sections render.
  expect(await page.locator("section, .section").count()).toBeGreaterThan(10);
});

test("home exposes indexable ElurJS metadata", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Elur.*JavaScript Framework.*ElurJS/);
  await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /ElurJS.*reactive JavaScript framework/i);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /index, follow/);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://www.elur.dev/");
  expect(await page.locator('script[type="application/ld+json"]').textContent()).toContain("ElurJS");
});

test("islands hydrate (Navbar, CounterDemo, Faq, ScrollReveal)", async ({ page }) => {
  await page.goto("/");
  await page.waitForTimeout(800);
  const hydrated = await page.evaluate(() =>
    Array.from(document.querySelectorAll("[data-elur-island]")).filter(
      (el) => (el as HTMLElement).__elur_js_island_dispose,
    ).length,
  );
  expect(hydrated).toBeGreaterThanOrEqual(6);

  // ScrollReveal adds .visible after scrolling.
  await page.evaluate(() => window.scrollTo(0, 900));
  await page.waitForTimeout(600);
  const revealed = await page.evaluate(() =>
    document.querySelectorAll(".animate-on-scroll.visible").length,
  );
  expect(revealed).toBeGreaterThan(0);
});

test("sitemap.xml and robots.txt are served", async ({ page }) => {
  const sitemap = await page.request.get("/sitemap.xml");
  expect(sitemap.status()).toBe(200);
  expect(await sitemap.text()).toContain("https://www.elur.dev");
  const robots = await page.request.get("/robots.txt");
  expect(robots.status()).toBe(200);
});
