import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const PRIMARY_SAMPLE_ROUTES = [
  "/",
  "/calculators/tax",
  "/calculators/sip",
  "/calculators/emi",
  "/calculators/nps",
  "/calculators/lrs-tcs",
  "/calculators/section-54",
  "/calculators/xirr",
];

test.describe("Accessibility Audits (Axe)", () => {
  for (const route of PRIMARY_SAMPLE_ROUTES) {
    test(`Accessibility compliance for ${route}`, async ({ page }) => {
      await page.goto(route, { waitUntil: "domcontentloaded" });

      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa"])
        .disableRules(["color-contrast"]) // Disabled for dark theme customization
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });
  }
});
