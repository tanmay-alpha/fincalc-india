import { describe, it, expect } from "vitest";
import { calcFIRE, calcNoCostEMITruth, calcCapitalGains } from "@/lib/math";

describe("Zero vs Missing Numeric Handling (Audit Compliance)", () => {
  describe("calcFIRE", () => {
    it("preserves 0% pre-retirement return without falling back to 12%", () => {
      const res = calcFIRE({
        currentAge: 30,
        retirementAge: 50,
        lifeExpectancy: 80,
        currentMonthlyExpenses: 50000,
        preRetirementReturn: 0,
        postRetirementReturn: 8,
        inflationRate: 6,
        currentSavings: 1000000,
      });

      expect(res.standardFireCorpus).toBeGreaterThan(0);
      // With 0% return over 20 years, existing savings remains 10L (not growing to ~96L with 12%)
      // This increases required monthly savings significantly:
      expect(res.requiredMonthlySavings).toBeGreaterThan(50000);
    });

    it("preserves 0% inflation without falling back to 6%", () => {
      const resWithZero = calcFIRE({
        currentAge: 30,
        retirementAge: 50,
        lifeExpectancy: 80,
        currentMonthlyExpenses: 50000,
        inflationRate: 0,
      });

      const resWithSix = calcFIRE({
        currentAge: 30,
        retirementAge: 50,
        lifeExpectancy: 80,
        currentMonthlyExpenses: 50000,
        inflationRate: 6,
      });

      expect(resWithZero.monthlyExpenseAtRetirement).toBe(50000); // exactly 50,000 with 0% inflation!
      expect(resWithSix.monthlyExpenseAtRetirement).toBeGreaterThan(150000); // grew with 6% inflation
    });
  });

  describe("calcNoCostEMITruth", () => {
    it("handles 0% bank interest rate without division by zero or falling back to 15%", () => {
      const res = calcNoCostEMITruth({
        productPrice: 60000,
        tenureMonths: 6,
        bankInterestRate: 0,
        processingFee: 0,
        gstRatePercent: 0,
      });

      expect(res.hiddenInterest).toBe(0);
      expect(res.totalCostEmi).toBe(60000);
      expect(res.monthlyEmi).toBe(10000);
    });
  });

  describe("calcCapitalGains", () => {
    it("preserves 0% investor slab rate without falling back to 30%", () => {
      const res = calcCapitalGains({
        assetClass: "specified_mutual_fund",
        purchasePrice: 100000,
        salePrice: 200000,
        investorSlabRatePercent: 0,
      });

      expect(res.taxRatePercent).toBe(0);
      expect(res.totalTaxPayable).toBe(0);
      expect(res.baseTaxPayable).toBe(0);
    });
  });
});
