import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { CALCULATOR_REGISTRY } from "../lib/registry";

// Audit all 31 registered calculator routes dynamically plus root & workspace pages
const ALL_AUDIT_ROUTES = [
  "/",
  "/history",
  ...CALCULATOR_REGISTRY.map((c) => c.route),
];

test.describe("Accessibility Audits (Axe Core WCAG 2A / 2AA)", () => {
  test.describe.configure({ retries: 0 });

  for (const route of ALL_AUDIT_ROUTES) {
    test(`Accessibility compliance for ${route}`, async ({ page }) => {
      await page.goto(route, { waitUntil: "domcontentloaded" });

      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa"])
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });
  }
});


