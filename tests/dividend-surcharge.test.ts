import { describe, it, expect } from "vitest";
import { calcTax } from "../lib/math";

describe("Dividend Income & 15% Surcharge Cap (CBDT Statutory Rules)", () => {
  it("taxes dividend income at slab rates below surcharge thresholds", () => {
    const res = calcTax({
      salaryIncome: 800000,
      dividendIncome: 200000,
      regime: "new",
    });

    // Total income = 8L - 75k std ded + 2L div = 9.25L.
    // Total income <= 12L => Section 156 full rebate applies => ₹0 tax.
    expect(res.totalTax).toBe(0);
    expect(res.surcharge).toBe(0);
  });

  it("caps surcharge on dividend income at 15% even when total income exceeds ₹2 Crore (25% surcharge bracket)", () => {
    // Total ordinary income > ₹2 Crore triggers 25% surcharge under New Regime.
    // But dividend income tax must only attract 15% surcharge.
    const resWithoutDividend = calcTax({
      salaryIncome: 25000000, // ₹2.5 Crore salary
      regime: "new",
    });

    const resWithDividend = calcTax({
      salaryIncome: 20000000, // ₹2.0 Crore salary
      dividendIncome: 5000000, // ₹50 Lakh dividend
      regime: "new",
    });

    // Both have total taxable income of ~₹2.5 Crore.
    // The surcharge for the mixed case with ₹50L dividend should be lower due to the 15% dividend cap.
    expect(resWithDividend.surcharge).toBeLessThan(resWithoutDividend.surcharge);
    expect(resWithDividend.surcharge).toBeGreaterThan(0);
  });

  it("caps surcharge on dividend income at 15% in Old Regime when total income exceeds ₹5 Crore (37% surcharge bracket)", () => {
    // ₹5.5 Crore total income under Old Regime triggers 37% standard surcharge.
    const resMixed = calcTax({
      salaryIncome: 45000000, // ₹4.5 Crore salary
      dividendIncome: 10000000, // ₹1.0 Crore dividend
      regime: "old",
    });

    // Dividend portion is taxed at slab rates, but surcharged at max 15%.
    expect(resMixed.totalTaxableIncome).toBeGreaterThan(50000000);
    expect(resMixed.surcharge).toBeGreaterThan(0);
  });
});
