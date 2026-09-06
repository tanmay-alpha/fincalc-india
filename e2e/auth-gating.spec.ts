import { test, expect } from "@playwright/test";
import { ALL_CALCULATOR_ROUTES } from "../lib/calculators";
import { CALCULATOR_REGISTRY } from "../lib/registry";

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
    await expect(page.locator("h1")).toContainText(/All calculators|Directory & Search/i);

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
    await expect(page.locator("h1")).toContainText(/Financial calculations for India/i);

    // Sign in with Google CTA
    const signInButton = page.getByRole("button", { name: /continue with google|sign in with google/i }).first();
    await expect(signInButton).toBeVisible();

    // Link to directory
    const exploreLink = page.getByRole("link", { name: /browse calculators|explore all 31 calculators/i });
    await expect(exploreLink).toBeVisible();
  });
});

test.describe("Authenticated User Experience (Test-Only Auth.js Session Strategy)", () => {
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

  test("Authenticated root (/) renders WorkspaceHome with user welcome", async ({ page }) => {
    const response = await page.goto("/", { waitUntil: "domcontentloaded" });
    expect(response?.status()).toBe(200);

    // Welcome back header
    await expect(page.locator("h1")).toContainText(/Welcome back, Test/i);

    // Interactive gate should not be present
    await expect(page.locator('[data-testid="interactive-auth-gate"]')).not.toBeVisible();
  });

  test("Authenticated /sip displays interactive calculator without gate", async ({ page }) => {
    const response = await page.goto("/sip", { waitUntil: "domcontentloaded" });
    expect(response?.status()).toBe(200);

    // Gate should not be visible
    await expect(page.locator('[data-testid="interactive-auth-gate"]')).not.toBeVisible();

    // Authenticated state wrapper visible
    await expect(page.locator('[data-auth-state="authenticated"]')).toBeVisible();
  });

  test("Authenticated /tax displays interactive calculator without gate", async ({ page }) => {
    const response = await page.goto("/tax", { waitUntil: "domcontentloaded" });
    expect(response?.status()).toBe(200);

    await expect(page.locator('[data-testid="interactive-auth-gate"]')).not.toBeVisible();
    await expect(page.locator('[data-auth-state="authenticated"]')).toBeVisible();
  });

  const representativeCalculators = [
    { category: "Investment", route: "/sip" },
    { category: "Tax", route: "/tax" },
    { category: "Loan", route: "/emi" },
    { category: "Trading", route: "/fno-brokerage" },
    { category: "Analyst", route: "/dcf-valuation" },
  ];

  for (const { category, route } of representativeCalculators) {
    test(`Authenticated representative ${category} calculator (${route}) is interactive`, async ({ page }) => {
      const response = await page.goto(route, { waitUntil: "domcontentloaded" });
      expect(response?.status()).toBe(200);

      await expect(page.locator('[data-testid="interactive-auth-gate"]')).not.toBeVisible();
      await expect(page.locator('[data-auth-state="authenticated"]')).toBeVisible();
    });
  }
});

test.describe("Auth Callback Flow & Safe Query Preservation", () => {
  test("Guest on /sip initiates Google auth with callbackUrl=/sip", async ({ page }) => {
    await page.goto("/sip", { waitUntil: "domcontentloaded" });

    const gate = page.locator('[data-testid="interactive-auth-gate"]');
    await expect(gate).toBeVisible();

    const signInBtn = page.locator('[data-testid="gate-signin-btn"]');

    // Intercept sign-in request
    const requestPromise = page.waitForRequest(
      (req) => req.url().includes("/api/auth/signin") && req.method() === "POST",
      { timeout: 10000 }
    );

    await signInBtn.click();
    const req = await requestPromise;
    const postData = req.postData() || "";
    expect(decodeURIComponent(postData)).toContain("callbackUrl=/sip");
  });

  test("Guest on /tax?regime=new initiates Google auth preserving query params", async ({ page }) => {
    await page.goto("/tax?regime=new", { waitUntil: "domcontentloaded" });

    const gate = page.locator('[data-testid="interactive-auth-gate"]');
    await expect(gate).toBeVisible();

    const signInBtn = page.locator('[data-testid="gate-signin-btn"]');

    const requestPromise = page.waitForRequest(
      (req) => req.url().includes("/api/auth/signin") && req.method() === "POST",
      { timeout: 10000 }
    );

    await signInBtn.click();
    const req = await requestPromise;
    const postData = req.postData() || "";
    expect(decodeURIComponent(postData)).toContain("callbackUrl=/tax?regime=new");
  });
});

test.describe("Registry-Driven Gating Architecture Invariants", () => {
  test("All 31 calculators in registry adhere to gating architecture", () => {
    expect(CALCULATOR_REGISTRY.length).toBe(31);
    for (const calc of CALCULATOR_REGISTRY) {
      expect(calc.route).toMatch(/^\/[a-z0-9-]+$/);
      expect(ALL_CALCULATOR_ROUTES).toContain(calc.route);
    }
  });
});
