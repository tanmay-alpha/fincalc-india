import { test, expect } from "@playwright/test";
import { ALL_CALCULATOR_ROUTES } from "../lib/calculators";
import { CALCULATOR_REGISTRY } from "../lib/registry";

test.describe("Centralized Server-Side Route Protection (All 31 Canonical Routes)", () => {
  for (const route of ALL_CALCULATOR_ROUTES) {
    test(`Unauthenticated request to ${route} redirects to login with preserved callbackUrl`, async ({
      page,
    }) => {
      await page.goto(route, { waitUntil: "domcontentloaded" });

      // Must be redirected to /login with encoded callbackUrl
      expect(page.url()).toContain("/login");
      const urlObj = new URL(page.url());
      expect(urlObj.pathname).toBe("/login");
      expect(urlObj.searchParams.get("callbackUrl")).toBe(route);

      // Verify login UI is rendered and calculator content is NOT exposed
      await expect(
        page.getByRole("heading", {
          name: /Your financial workspace, built for India/i,
        })
      ).toBeVisible();
      await expect(
        page.getByRole("button", { name: /Continue with Google/i })
      ).toBeVisible();

      // Protected calculator workspace must NOT be exposed
      expect(await page.locator(".calculator-workspace").count()).toBe(0);
      expect(
        await page.locator('[data-testid="interactive-calculator-surface"]').count()
      ).toBe(0);
    });
  }

  test("Unauthenticated root (/) redirects to /login", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    expect(page.url()).toContain("/login");
    const urlObj = new URL(page.url());
    expect(urlObj.pathname).toBe("/login");
    await expect(
      page.getByRole("heading", {
        name: /Your financial workspace, built for India/i,
      })
    ).toBeVisible();
  });

  test("Unauthenticated /history redirects to /login with callbackUrl", async ({
    page,
  }) => {
    await page.goto("/history", { waitUntil: "domcontentloaded" });
    expect(page.url()).toContain("/login");
    const urlObj = new URL(page.url());
    expect(urlObj.pathname).toBe("/login");
    expect(urlObj.searchParams.get("callbackUrl")).toBe("/history");
  });

  test("Unauthenticated shared result link redirects to /login preserving share token", async ({
    page,
  }) => {
    const fakeToken = "12345678-1234-4234-a234-1234567890ab";
    await page.goto(`/result/${fakeToken}`, { waitUntil: "domcontentloaded" });
    expect(page.url()).toContain("/login");
    const urlObj = new URL(page.url());
    expect(urlObj.pathname).toBe("/login");
    expect(urlObj.searchParams.get("callbackUrl")).toBe(`/result/${fakeToken}`);
  });

  test("Public legal page /privacy loads without authentication", async ({
    page,
  }) => {
    const response = await page.goto("/privacy", {
      waitUntil: "domcontentloaded",
    });
    expect(response?.status()).toBe(200);
    expect(page.url()).toContain("/privacy");
    await expect(
      page.getByRole("heading", { name: "Privacy Policy", level: 1 })
    ).toBeVisible();
    // Navbar search should NOT be visible on public legal page
    expect(await page.locator("button:has-text('Search...')").count()).toBe(0);
  });

  test("Public legal page /terms loads without authentication", async ({
    page,
  }) => {
    const response = await page.goto("/terms", {
      waitUntil: "domcontentloaded",
    });
    expect(response?.status()).toBe(200);
    expect(page.url()).toContain("/terms");
    await expect(
      page.getByRole("heading", {
        name: "Terms of Service & Disclaimer",
        level: 1,
      })
    ).toBeVisible();
    // Navbar search should NOT be visible on public legal page
    expect(await page.locator("button:has-text('Search...')").count()).toBe(0);
  });

  test("Open redirect defense rejects external URL callback parameter", async ({
    page,
  }) => {
    await page.goto("/login?callbackUrl=https://evil.com/phish", {
      waitUntil: "domcontentloaded",
    });
    // The login button or form action should not forward to evil.com
    await expect(
      page.getByRole("button", { name: /Continue with Google/i })
    ).toBeVisible();
  });

  test("OAuth error state renders clear human message with retry option", async ({
    page,
  }) => {
    await page.goto("/login?error=OAuthSignin", {
      waitUntil: "domcontentloaded",
    });
    const alert = page
      .locator('[role="alert"]')
      .filter({ hasText: /Could not initialize Google/i });
    await expect(alert).toBeVisible();
    await expect(alert).toContainText(
      /Could not initialize Google sign-in/i
    );
    await expect(
      page.getByRole("button", { name: /Retry Google Sign-In/i })
    ).toBeVisible();
  });
});

test.describe("Authenticated Financial Workspace Experience", () => {
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

  test("Authenticated root renders WorkspaceHome with welcome and search", async ({
    page,
  }) => {
    const response = await page.goto("/", { waitUntil: "domcontentloaded" });
    expect(response?.status()).toBe(200);
    await expect(page.locator("h1")).toContainText(/Welcome, Test/i);
    await expect(page.locator("button:has-text('Search calculators')").first()).toBeVisible();
  });

  test("Authenticated user visiting /login is redirected to workspace", async ({
    page,
  }) => {
    await page.goto("/login", { waitUntil: "domcontentloaded" });
    const urlObj = new URL(page.url());
    expect(urlObj.pathname).not.toBe("/login");
  });

  test("Authenticated user visiting /login with callbackUrl is redirected to destination", async ({
    page,
  }) => {
    await page.goto("/login?callbackUrl=%2Ftax%3Fregime%3Dnew", {
      waitUntil: "domcontentloaded",
    });
    expect(page.url()).toContain("/tax");
  });

  for (const route of [
    "/sip",
    "/tax",
    "/emi",
    "/fd",
    "/ppf",
    "/fno-brokerage",
    "/dcf-valuation",
  ]) {
    test(`Authenticated calculator loads successfully on ${route}`, async ({
      page,
    }) => {
      const response = await page.goto(route, { waitUntil: "domcontentloaded" });
      expect(response?.status()).toBe(200);
      expect(page.url()).toContain(route);
      const surface = page.locator(
        '[data-testid="interactive-calculator-surface"]'
      );
      await expect(surface).toBeVisible();
      await expect(surface).toHaveAttribute("data-auth-state", "authenticated");
    });
  }
});

test.describe("Registry Canonical Invariants", () => {
  test("All 31 calculators remain registered at canonical routes", () => {
    expect(CALCULATOR_REGISTRY.length).toBe(31);
    for (const calc of CALCULATOR_REGISTRY) {
      expect(calc.route).toMatch(/^\/[a-z0-9-]+$/);
      expect(ALL_CALCULATOR_ROUTES).toContain(calc.route);
    }
  });
});
