import { test, expect } from "@playwright/test";

const CALCULATOR_ROUTES = [
  "/sip", "/step-up-sip", "/lumpsum", "/fd", "/ppf", "/fire", "/xirr-cagr-twrr",
  "/tax", "/capital-gains-tax", "/hra-exemption", "/presumptive-tax", "/section-54-exemption",
  "/marginal-relief", "/lrs-tcs", "/fno-brokerage", "/option-payoff", "/black-scholes",
  "/position-size", "/margin-calculator", "/emi", "/loan-prepayment", "/no-cost-emi",
  "/car-loan-tco", "/balance-transfer", "/dcf-valuation", "/wacc", "/dupont-analysis",
  "/us-stock-tax", "/nre-nro-fcnr", "/nps", "/portfolio-risk",
];

test.describe("All Calculator Pages Smoke Tests", () => {
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

      expect(consoleErrors, `Console errors on ${route}`).toEqual([]);
    });
  }
});
