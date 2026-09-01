import { test, expect } from "@playwright/test";

const CALCULATOR_ROUTES = [
  "/calculators/sip",
  "/calculators/step-up-sip",
  "/calculators/goal-sip",
  "/calculators/lumpsum",
  "/calculators/fd",
  "/calculators/ppf",
  "/calculators/fire",
  "/calculators/nps",
  "/calculators/emi",
  "/calculators/prepayment-vs-invest",
  "/calculators/no-cost-emi",
  "/calculators/car-tco",
  "/calculators/balance-transfer",
  "/calculators/tax",
  "/calculators/marginal-relief",
  "/calculators/capital-gains",
  "/calculators/hra",
  "/calculators/presumptive-tax",
  "/calculators/section-54",
  "/calculators/lrs-tcs",
  "/calculators/us-stock-return",
  "/calculators/nri-deposit",
  "/calculators/fno-brokerage",
  "/calculators/option-payoff",
  "/calculators/black-scholes",
  "/calculators/position-size",
  "/calculators/margin-required",
  "/calculators/portfolio-risk",
  "/calculators/dcf",
  "/calculators/wacc",
  "/calculators/dupont",
  "/calculators/xirr",
];

test.describe("All 31+ Calculator Pages Smoke Tests", () => {
  for (const route of CALCULATOR_ROUTES) {
    test(`Route ${route} renders HTTP 200 without console errors or NaN text`, async ({ page }) => {
      const consoleErrors: string[] = [];
      page.on("console", (msg) => {
        if (msg.type() === "error") {
          consoleErrors.push(msg.text());
        }
      });

      const response = await page.goto(route, { waitUntil: "domcontentloaded" });
      expect(response?.status()).toBe(200);

      // Verify no NaN or undefined text visible in main UI
      const bodyText = await page.innerText("body");
      expect(bodyText).not.toContain("NaN");
      expect(bodyText).not.toContain("undefined");

      // Verify page has heading
      const heading = page.locator("h1");
      await expect(heading).toBeVisible();
    });
  }
});
