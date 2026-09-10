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

  test.describe("Authenticated Workspace Accessibility", () => {
    test.beforeEach(async ({ context, baseURL }) => {
      const targetUrl = baseURL || "http://localhost:3000";
      await context.addCookies([
        {
          name: "authjs.session-token",
          value: "test-e2e-session-token",
          url: targetUrl,
        },
        {
          name: "next-auth.session-token",
          value: "test-e2e-session-token",
          url: targetUrl,
        },
      ]);
    });

    for (const route of ALL_AUDIT_ROUTES) {
      test(`Accessibility compliance for ${route}`, async ({ page }) => {
        await page.goto(route, { waitUntil: "domcontentloaded" });

        const accessibilityScanResults = await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa"])
          .analyze();

        expect(accessibilityScanResults.violations).toEqual([]);
      });
    }

    test("Accessibility compliance for Assumptions Drawer dialog", async ({ page }) => {
      await page.goto("/sip", { waitUntil: "domcontentloaded" });
      const trigger = page.getByRole("button", { name: /View assumptions & statutory sources/i });
      if (await trigger.isVisible()) {
        await trigger.click();
        const dialog = page.locator('[role="dialog"]');
        await dialog.waitFor({ state: "visible" });
        await page.waitForTimeout(300);
        const results = await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa"])
          .analyze();
        expect(results.violations).toEqual([]);
      }
    });

    test("Accessibility compliance for Command Menu dialog", async ({ page }) => {
      await page.goto("/", { waitUntil: "domcontentloaded" });
      await page.keyboard.press("Control+k");
      const dialog = page.getByRole("dialog");
      if (await dialog.isVisible()) {
        await page.waitForTimeout(300);
        const results = await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa"])
          .analyze();
        expect(results.violations).toEqual([]);
      }
    });
  });

  test.describe("Public / Auth Pages Accessibility", () => {
    for (const publicRoute of ["/login", "/privacy", "/terms"]) {
      test(`Accessibility compliance for public route ${publicRoute}`, async ({ page }) => {
        await page.goto(publicRoute, { waitUntil: "domcontentloaded" });

        const accessibilityScanResults = await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa"])
          .analyze();

        expect(accessibilityScanResults.violations).toEqual([]);
      });
    }
  });
});
