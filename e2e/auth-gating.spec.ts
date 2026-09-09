import { test, expect } from "@playwright/test";
import { ALL_CALCULATOR_ROUTES } from "../lib/calculators";
import { CALCULATOR_REGISTRY } from "../lib/registry";

test.describe("Public Calculator Access & Account Boundaries", () => {
  for (const route of ALL_CALCULATOR_ROUTES) {
    test(`Unauthenticated calculator remains interactive on ${route}`, async ({ page }) => {
      const response = await page.goto(route, { waitUntil: "domcontentloaded" });
      expect(response?.status()).toBe(200);

      await expect(page.locator("h1:visible").first()).toBeVisible();
      await expect(page.locator("nav[aria-label='Breadcrumb']:visible").first()).toBeVisible();

      const surface = page.locator('[data-testid="interactive-calculator-surface"]:visible');
      await expect(surface).toBeVisible();
      await expect(surface).toHaveAttribute("data-auth-state", /guest|loading/);
      await expect(page.locator('[data-testid="interactive-auth-gate"]')).not.toBeVisible();

      const bodyText = await page.innerText("body");
      expect(bodyText).not.toMatch(/Sign in to use .*Calculator/i);
    });
  }

  test("Calculators directory is public and displays all tools", async ({ page }) => {
    const response = await page.goto("/calculators", { waitUntil: "domcontentloaded" });
    expect(response?.status()).toBe(200);
    await expect(page.locator("h1")).toContainText(/All calculators|Directory & Search/i);
    expect(await page.locator("[role='tablist'] [role='tab']").count()).toBeGreaterThanOrEqual(6);
  });

  test("Root homepage explains that account features are optional", async ({ page }) => {
    const response = await page.goto("/", { waitUntil: "domcontentloaded" });
    expect(response?.status()).toBe(200);
    await expect(page.locator("h1")).toContainText(/Financial calculations for India/i);
    await expect(page.getByRole("link", { name: /browse calculators|explore all 31 calculators/i })).toBeVisible();
  });
});

test.describe("Authenticated User Experience", () => {
  test.beforeEach(async ({ context, baseURL }) => {
    const targetUrl = baseURL || "http://localhost:3000";
    await context.addCookies([
      { name: "authjs.session-token", value: "test-e2e-session-token", url: targetUrl },
      { name: "next-auth.session-token", value: "test-e2e-session-token", url: targetUrl },
    ]);
  });

  test("Authenticated root renders WorkspaceHome", async ({ page }) => {
    const response = await page.goto("/", { waitUntil: "domcontentloaded" });
    expect(response?.status()).toBe(200);
    await expect(page.locator("h1")).toContainText(/Welcome back, Test/i);
  });

  for (const route of ["/sip", "/tax", "/emi", "/fno-brokerage", "/dcf-valuation"]) {
    test(`Authenticated calculator surface remains available on ${route}`, async ({ page }) => {
      const response = await page.goto(route, { waitUntil: "domcontentloaded" });
      expect(response?.status()).toBe(200);
      const surface = page.locator('[data-testid="interactive-calculator-surface"]');
      await expect(surface).toBeVisible();
      await expect(surface).toHaveAttribute("data-auth-state", "authenticated");
      await expect(page.locator('[data-testid="interactive-auth-gate"]')).not.toBeVisible();
    });
  }
});

test.describe("Registry-Driven Public Surface Invariants", () => {
  test("All 31 calculators remain registered at canonical routes", () => {
    expect(CALCULATOR_REGISTRY.length).toBe(31);
    for (const calc of CALCULATOR_REGISTRY) {
      expect(calc.route).toMatch(/^\/[a-z0-9-]+$/);
      expect(ALL_CALCULATOR_ROUTES).toContain(calc.route);
    }
  });
});
