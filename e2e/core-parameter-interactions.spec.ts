import { test, expect } from "@playwright/test";

const cases = [
  { route: "/sip", label: "Monthly Investment", value: "50000" },
  { route: "/emi", label: "Loan Amount", value: "5000000" },
  { route: "/fd", label: "Principal Amount", value: "500000" },
  { route: "/ppf", label: "Yearly Investment", value: "100000" },
  { route: "/lumpsum", label: "Investment Amount", value: "1000000" },
  { route: "/tax", label: "Salary / Pension Income", value: "1800000" },
] as const;

test.describe("Core calculator parameter interactions for public guests", () => {
  for (const scenario of cases) {
    test(`${scenario.route} accepts direct numeric input and recalculates without authentication`, async ({
      page,
    }) => {
      const pageErrors: Error[] = [];
      page.on("pageerror", (error) => pageErrors.push(error));

      await page.goto(scenario.route, { waitUntil: "domcontentloaded" });
      const surface = page.locator('[data-testid="interactive-calculator-surface"]');
      await expect(surface).toBeVisible();

      const input = page.getByLabel(scenario.label, { exact: true });
      await expect(input).toBeVisible();
      await input.fill(scenario.value);
      await input.press("Enter");

      const bodyText = await page.innerText("body");
      expect(bodyText).not.toMatch(/\bNaN\b/);
      expect(bodyText).not.toMatch(/\bundefined\b/);
      expect(bodyText).not.toMatch(/\bInfinity\b/);
      expect(pageErrors).toEqual([]);
    });
  }
});
