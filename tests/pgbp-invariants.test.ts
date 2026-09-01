import { describe, it, expect } from "vitest";
import { calcTax, computePGBPTax, calcPresumptiveTax } from "../lib/math";

describe("Tax Invariant & PGBP Unification Test Suite (AY 2026-27)", () => {
  const mandatoryTestValues = [
    500000,
    1200000,
    1200001,
    1200100,
    1250000,
    1270000,
    1500000,
    5000000,
    5000001,
    10000001,
  ];

  it("Invariant 1: Pure business income in calcTax exactly matches computePGBPTax under New Regime", () => {
    for (const taxableProfit of mandatoryTestValues) {
      const canonicalResult = calcTax({
        salaryIncome: 0,
        businessIncome: taxableProfit,
        interestAndOtherIncome: 0,
        residency: "resident_individual",
        regime: "new",
      });

      const pgbpResult = computePGBPTax(taxableProfit, "new");

      expect(pgbpResult.totalTax).toBe(canonicalResult.totalTax);
      expect(pgbpResult.rebate).toBe(canonicalResult.rebateAmount);
      expect(pgbpResult.surcharge).toBe(canonicalResult.surcharge);
      expect(pgbpResult.cess).toBe(canonicalResult.cess);
    }
  });

  it("Invariant 2: Pure business income in calcTax exactly matches computePGBPTax under Old Regime", () => {
    for (const taxableProfit of mandatoryTestValues) {
      const canonicalResult = calcTax({
        salaryIncome: 0,
        businessIncome: taxableProfit,
        interestAndOtherIncome: 0,
        residency: "resident_individual",
        regime: "old",
      });

      const pgbpResult = computePGBPTax(taxableProfit, "old");

      expect(pgbpResult.totalTax).toBe(canonicalResult.totalTax);
      expect(pgbpResult.rebate).toBe(canonicalResult.rebateAmount);
      expect(pgbpResult.surcharge).toBe(canonicalResult.surcharge);
      expect(pgbpResult.cess).toBe(canonicalResult.cess);
    }
  });

  it("Invariant 3: Zero standard deduction applied on pure business income under New Regime", () => {
    const res = calcTax({
      salaryIncome: 0,
      businessIncome: 1200000,
      residency: "resident_individual",
      regime: "new",
    });

    expect(res.standardDeduction).toBe(0);
    expect(res.totalTaxableIncome).toBe(1200000);
    expect(res.totalTax).toBe(0); // Section 156 full rebate
  });

  it("Invariant 4: Section 156(2)(b) marginal rebate tapering holds identically across PGBP and canonical tax", () => {
    // At ₹12,00,001: Net tax before cess must equal excess income of ₹1
    const res1200001 = calcTax({
      salaryIncome: 0,
      businessIncome: 1200001,
      residency: "resident_individual",
      regime: "new",
    });
    const pgbp1200001 = computePGBPTax(1200001, "new");

    expect(res1200001.taxBeforeCess).toBe(1);
    expect(pgbp1200001.taxPayableBeforeCess).toBe(1);
    expect(res1200001.totalTax).toBe(1);
    expect(pgbp1200001.totalTax).toBe(1);

    // At ₹12,00,100: Net tax before cess must equal excess income of ₹100
    const res1200100 = calcTax({
      salaryIncome: 0,
      businessIncome: 1200100,
      residency: "resident_individual",
      regime: "new",
    });
    const pgbp1200100 = computePGBPTax(1200100, "new");

    expect(res1200100.taxBeforeCess).toBe(100);
    expect(pgbp1200100.taxPayableBeforeCess).toBe(100);
    expect(res1200100.totalTax).toBe(104); // 100 + 4% cess = 104
    expect(pgbp1200100.totalTax).toBe(104);
  });

  it("Invariant 5: Surcharge threshold marginal relief consistency at ₹50,00,001 and ₹1,00,00,001", () => {
    for (const income of [5000001, 10000001]) {
      const canonical = calcTax({
        salaryIncome: 0,
        businessIncome: income,
        residency: "resident_individual",
        regime: "new",
      });
      const pgbp = computePGBPTax(income, "new");

      expect(pgbp.totalTax).toBe(canonical.totalTax);
      expect(pgbp.surcharge).toBe(canonical.surcharge);
    }
  });

  it("Invariant 6: Presumptive Tax under 44AD / 44ADA computes underlying tax via canonical engine", () => {
    // 44AD with ₹1 Crore digital turnover at 6% deemed profit = ₹6 Lakh profit
    const res44ad = calcPresumptiveTax({
      professionType: "44AD_business",
      grossTurnover: 10000000,
      digitalReceiptsPercentage: 100,
      regime: "new",
    });

    const expectedTax = computePGBPTax(600000, "new").totalTax;
    expect(res44ad.presumptiveIncome).toBe(600000);
    expect(res44ad.presumptiveTaxPayable).toBe(expectedTax);
    expect(res44ad.presumptiveTaxPayable).toBe(0); // 6L is <= 12L Section 156 rebate threshold
  });
});
