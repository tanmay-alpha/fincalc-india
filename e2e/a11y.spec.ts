import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const PRIMARY_SAMPLE_ROUTES = [
  "/",
  "/tax",
  "/sip",
  "/emi",
  "/nps",
  "/lrs-tcs",
  "/section-54-exemption",
  "/xirr-cagr-twrr",
];

test.describe("Accessibility Audits (Axe)", () => {
  for (const route of PRIMARY_SAMPLE_ROUTES) {
    test(`Accessibility compliance for ${route}`, async ({ page }) => {
      const response = await page.goto(route, { waitUntil: "domcontentloaded" });
      expect(response?.status()).toBe(200);
      await expect(page.locator("h1")).toBeVisible();

      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa"])
        .disableRules(["color-contrast"]) // Disabled for dark theme customization
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });
  }
});
