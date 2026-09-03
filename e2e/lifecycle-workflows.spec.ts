import { test, expect } from "@playwright/test";
import { prisma } from "../lib/prisma";
import { randomUUID } from "crypto";

test.describe.serial("Calculation Lifecycle E2E Workflows", () => {
  test.describe.configure({ retries: 0 });

  const testEmail = `lifecycle-e2e-${Date.now()}@fincalc-india.test`;
  const shareToken = randomUUID();
  let testUserId: string | undefined;
  let calculationId: string | undefined;

  test.beforeAll(async () => {
    if (!process.env.DATABASE_URL) {
      return;
    }

    try {
      const user = await prisma.user.create({
        data: {
          email: testEmail,
          name: "Lifecycle E2E Test User",
        },
      });
      testUserId = user.id;

      const calc = await prisma.calculation.create({
        data: {
          userId: testUserId,
          type: "sip",
          label: "E2E Lifecycle SIP Calculation",
          inputs: {
            monthlyInvestment: 15000,
            expectedReturnRate: 12,
            timePeriodYears: 10,
          },
          outputs: {
            investedAmount: 1800000,
            estimatedReturns: 1685121,
            totalValue: 3485121,
          },
          isShared: false,
          shareId: null,
        },
      });
      calculationId = calc.id;
    } catch {
      // Postgres not available locally
    }
  });

  test.afterAll(async () => {
    if (testUserId) {
      try {
        await prisma.user.delete({ where: { id: testUserId } });
      } catch {
        // Ignored
      }
    }
  });

  test.beforeEach(() => {
    test.skip(!testUserId, "PostgreSQL database not available in local environment");
  });

  test("1. Verify private calculation cannot be accessed publicly", async ({ request }) => {
    const res = await request.get(`/api/result/${calculationId}`);
    expect(res.status()).toBe(404);
    expect(res.headers()["cache-control"]).toContain("no-store");
    expect(res.headers()["x-robots-tag"]).toContain("noindex");
  });

  test("2. Publish calculation and verify public access with no-store caching", async ({ request, page }) => {
    if (calculationId) {
      // In CI / Postgres environment: publish via database update
      await prisma.calculation.update({
        where: { id: calculationId },
        data: {
          isShared: true,
          shareId: shareToken,
        },
      });

      // Verify API returns 200 with no-store headers
      const apiRes = await request.get(`/api/result/${shareToken}`);
      expect(apiRes.status()).toBe(200);
      expect(apiRes.headers()["cache-control"]).toContain("no-store");

      // Visit public result page in browser
      await page.goto(`/result/${shareToken}`, { waitUntil: "domcontentloaded" });
      const heading = page.locator("h1").first();
      await expect(heading).toBeVisible();

      const bodyText = await page.innerText("body");
      expect(bodyText).toContain("SIP");
      expect(bodyText).not.toMatch(/\bNaN\b/);
    }
  });

  test("3. Revoke share link and validate immediate 404", async ({ request, page }) => {
    if (calculationId) {
      // Revoke calculation
      await prisma.calculation.update({
        where: { id: calculationId },
        data: {
          isShared: false,
          shareId: null,
        },
      });
    }

    // API immediately returns 404 with no-store & noindex headers
    const apiRes = await request.get(`/api/result/${shareToken}`);
    expect(apiRes.status()).toBe(404);
    expect(apiRes.headers()["cache-control"]).toContain("no-store");
    expect(apiRes.headers()["x-robots-tag"]).toContain("noindex");

    // Browser navigation to old link returns 404
    const pageRes = await page.goto(`/result/${shareToken}`);
    expect(pageRes?.status()).toBe(404);
  });
});
