import { test, expect } from "@playwright/test";
import { ALL_CALCULATOR_ROUTES } from "../lib/calculators";

test.describe("Universal Authentication Gating & Public Surface Tests", () => {
  // 1. All 31 calculator routes must display interactive gate when unauthenticated
  for (const route of ALL_CALCULATOR_ROUTES) {
    test(`Unauthenticated gate renders on ${route}`, async ({ page }) => {
      const response = await page.goto(route, { waitUntil: "domcontentloaded" });
      expect(response?.status()).toBe(200);

      // Verify public SEO elements: H1 is visible
      const h1 = page.locator("h1:visible").first();
      await expect(h1).toBeVisible();

      // Verify breadcrumb exists
      const breadcrumb = page.locator("nav[aria-label='Breadcrumb']:visible").first();
      await expect(breadcrumb).toBeVisible();

      // Verify interactive gate is active
      const gate = page.locator('[data-testid="interactive-auth-gate"]:visible');
      await expect(gate).toBeVisible();

      // Verify Google sign-in CTA button inside gate
      const signInBtn = page.locator('[data-testid="gate-signin-btn"]:visible');
      await expect(signInBtn).toBeVisible();
    });
  }

  // 2. Public /calculators directory must NOT be gated
  test("Calculators directory (/calculators) is public and displays all tools", async ({ page }) => {
    const response = await page.goto("/calculators", { waitUntil: "domcontentloaded" });
    expect(response?.status()).toBe(200);

    // Verify directory header
    await expect(page.locator("h1")).toContainText(/Directory & Search/i);

    // Verify all category tabs exist
    const tabs = page.locator("[role='tablist'] [role='tab']");
    expect(await tabs.count()).toBeGreaterThanOrEqual(6); // All + 5 categories

    // Gate should NOT be present on the directory page
    const gate = page.locator('[data-testid="interactive-auth-gate"]');
    await expect(gate).not.toBeVisible();
  });

  // 3. Shared calculation route exception: public and un-gated
  test("Shared calculation page (/result/nonexistent) is public", async ({ page }) => {
    const response = await page.goto("/result/nonexistent-share-token-12345", {
      waitUntil: "domcontentloaded",
    });
    // Either 404 page or not found state rendered cleanly
    expect([200, 404]).toContain(response?.status());

    // Gate should NOT be present on shared result page
    const gate = page.locator('[data-testid="interactive-auth-gate"]');
    await expect(gate).not.toBeVisible();
  });

  // 4. Root homepage unauthenticated view is editorial GuestLanding
  test("Root homepage (/) renders GuestLanding for unauthenticated users", async ({ page }) => {
    const response = await page.goto("/", { waitUntil: "domcontentloaded" });
    expect(response?.status()).toBe(200);

    // Editorial headline
    await expect(page.locator("h1")).toContainText(/Comprehensive, compliant financial calculation suite/i);

    // Sign in with Google CTA
    const signInButton = page.getByRole("button", { name: /sign in with google/i }).first();
    await expect(signInButton).toBeVisible();

    // Link to directory
    const exploreLink = page.getByRole("link", { name: /explore all 31 calculators/i });
    await expect(exploreLink).toBeVisible();
  });
});
