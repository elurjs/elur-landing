import { test, expect } from "@playwright/test";

// No-JS fallback: SSG content renders without JavaScript.
test.use({ javaScriptEnabled: false });

test("home renders without JS", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("h1").first()).toContainText("Elur");
  await expect(page.locator("h1").first()).toContainText("reactive JavaScript UIs");
  // Island markers are still in the HTML (progressive enhancement).
  expect(await page.locator("[data-elur-island]").count()).toBeGreaterThan(0);
});
