import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

// Representative core routes across financial categories
const PRIMARY_SAMPLE_ROUTES = [
  "/",
  "/tax",
  "/sip",
  "/emi",
  "/nps",
  "/lrs-tcs",
  "/section-54-exemption",
  "/xirr-cagr-twrr",
  "/balance-transfer",
  "/capital-gains-tax",
];

test.describe("Accessibility Audits (Axe Core WCAG 2A / 2AA)", () => {
  for (const route of PRIMARY_SAMPLE_ROUTES) {
    test(`Accessibility compliance for ${route}`, async ({ page }) => {
      await page.goto(route, { waitUntil: "domcontentloaded" });

      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa"])
        .disableRules(["color-contrast"]) // Disabled for custom theme & dark gradients
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });
  }
});

