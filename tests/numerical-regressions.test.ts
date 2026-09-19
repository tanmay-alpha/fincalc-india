import { describe, it, expect } from "vitest";
import { calcEMI, calcFIRE, calcOptionPayoff, calcXIRR } from "@/lib/math";

describe("FinCalc India — Numerical Core & Defect Regressions", () => {
  // ─── F-MATH-01: OPTION PAYOFF REGRESSIONS ───────────────────
  describe("F-MATH-01: Option Payoff Exact Analytical Metrics", () => {
    it("computes exact analytical breakeven independent of chart sampling step", () => {
      // Bull Call Spread: Buy 24000 Call @ 200, Sell 24500 Call @ 50
      // Max profit = (24500 - 24000) - (200 - 50) = 500 - 150 = 350 * 50 = 17,500
      // Max loss = -(200 - 50) * 50 = -150 * 50 = -7,500
      // Breakeven = 24000 + 150 = 24150
      const resCoarse = calcOptionPayoff({
        lotSize: 50,
        underlyingPrice: 24000,
        minSpot: 20000,
        maxSpot: 30000,
        step: 500, // Very coarse step that misses 24150
        legs: [
          { strike: 24000, type: "call", position: "buy", premium: 200, lots: 1 },
          { strike: 24500, type: "call", position: "sell", premium: 50, lots: 1 },
        ],
      });

      const resFine = calcOptionPayoff({
        lotSize: 50,
        underlyingPrice: 24000,
        minSpot: 20000,
        maxSpot: 30000,
        step: 25,
        legs: [
          { strike: 24000, type: "call", position: "buy", premium: 200, lots: 1 },
          { strike: 24500, type: "call", position: "sell", premium: 50, lots: 1 },
        ],
      });

      // Breakevens and max profit/loss must match EXACTLY between coarse and fine steps
      expect(resCoarse.breakevens).toEqual([24150]);
      expect(resFine.breakevens).toEqual([24150]);
      expect(resCoarse.maxProfit).toBe(17500);
      expect(resFine.maxProfit).toBe(17500);
      expect(resCoarse.maxLoss).toBe(-7500);
      expect(resFine.maxLoss).toBe(-7500);
    });

    it("guards against zero, negative, or NaN step and prevents infinite loop", () => {
      const res = calcOptionPayoff({
        lotSize: 50,
        underlyingPrice: 24000,
        minSpot: 23000,
        maxSpot: 25000,
        step: 0, // Hazardous zero step
        legs: [
          { strike: 24000, type: "call", position: "buy", premium: 100, lots: 1 },
        ],
      });

      expect(res.chartData.length).toBeGreaterThan(0);
      expect(res.chartData.length).toBeLessThanOrEqual(2000);
    });
  });

  // ─── F-MATH-02: XIRR REGRESSIONS ─────────────────────────────
  describe("F-MATH-02: XIRR Robustness & Degeneracy Handling", () => {
    it("rejects invalid/unparseable dates upfront", () => {
      const res = calcXIRR([
        { date: "not-a-date", amount: -100000 },
        { date: "2025-01-01", amount: 150000 },
      ]);

      expect(res.isValid).toBe(false);
      expect(res.errorMessage?.toLowerCase()).toContain("invalid");
    });

    it("rejects non-finite cash flow amounts upfront", () => {
      const res = calcXIRR([
        { date: "2024-01-01", amount: -100000 },
        { date: "2025-01-01", amount: NaN },
      ]);

      expect(res.isValid).toBe(false);
    });

    it("handles zero-duration / same-date cashflow degeneracy gracefully", () => {
      const res = calcXIRR([
        { date: "2025-01-01", amount: -100000 },
        { date: "2025-01-01", amount: 100000 },
      ]);

      expect(res.isValid).toBe(false);
      expect(res.errorMessage).toContain("zero duration");
    });

    it("computes accurate XIRR for standard multi-year periodic investment", () => {
      const res = calcXIRR([
        { date: "2022-01-01", amount: -100000 },
        { date: "2023-01-01", amount: -100000 },
        { date: "2024-01-01", amount: -100000 },
        { date: "2025-01-01", amount: 400000 },
      ]);

      expect(res.isValid).toBe(true);
      expect(res.xirr).toBeGreaterThan(10);
      expect(res.xirr).toBeLessThan(25);
    });
  });

  // ─── F-MATH-03: FIRE CONTRIBUTIONS & PERPETUAL CORPUS ────────
  describe("F-MATH-03: FIRE Compounding & Perpetual Checks", () => {
    it("synchronizes monthly savings accumulation with retirement timeline", () => {
      const res = calcFIRE({
        currentAge: 30,
        retirementAge: 50,
        lifeExpectancy: 80,
        currentMonthlyExpenses: 50000,
        preRetirementReturn: 12,
        postRetirementReturn: 8,
        inflationRate: 6,
        currentSavings: 500000,
      });

      expect(res.requiredMonthlySavings).toBeGreaterThan(0);
      // At retirement age (year 20), corpus should match or closely reach standardFireCorpus
      const retirementPoint = res.timeline.find((p) => p.age === 50);
      expect(retirementPoint).toBeDefined();
      expect(retirementPoint!.corpus).toBeGreaterThanOrEqual(
        res.standardFireCorpus * 0.90
      );
    });

    it("does NOT mark an unfunded retirement-now plan as perpetual", () => {
      const res = calcFIRE({
        currentAge: 50,
        retirementAge: 50, // Retirement is now
        lifeExpectancy: 80,
        currentMonthlyExpenses: 100000,
        preRetirementReturn: 10,
        postRetirementReturn: 8,
        inflationRate: 6,
        currentSavings: 0, // Unfunded!
      });

      expect(res.isPerpetual).toBe(false);
      expect(res.depletionAge).toBe(51);
    });
  });

  // ─── F-MATH-04: EMI AMORTIZATION SCHEDULE RECONCILIATION ─────
  describe("F-MATH-04: EMI Schedule Exact Reconciliation", () => {
    it("ensures principal + interest exactly equals emi, final balance is 0, and principal sum matches loan", () => {
      const loanAmount = 5000000; // ₹50 Lakhs
      const annualRate = 8.5;
      const tenureMonths = 240; // 20 years

      const res = calcEMI({
        principal: loanAmount,
        annualRate,
        tenureMonths,
      });

      expect(res.amortizationSchedule.length).toBe(tenureMonths);

      let totalPrincipalSum = 0;
      let totalInterestSum = 0;

      for (let i = 0; i < res.amortizationSchedule.length; i++) {
        const row = res.amortizationSchedule[i];
        expect(row.principal + row.interest).toBe(row.emi);
        totalPrincipalSum += row.principal;
        totalInterestSum += row.interest;
      }

      // Final month balance must be 0
      const lastRow = res.amortizationSchedule[res.amortizationSchedule.length - 1];
      expect(lastRow.balance).toBe(0);

      // Sum of principal amortized must equal total loan amount
      expect(totalPrincipalSum).toBe(loanAmount);
      expect(totalInterestSum).toBe(res.totalInterest);
    });

    it("supports zero-interest EMI without division by zero", () => {
      const res = calcEMI({
        principal: 120000,
        annualRate: 0,
        tenureMonths: 12,
      });

      expect(res.emi).toBe(10000);
      expect(res.totalInterest).toBe(0);
      expect(res.totalPayment).toBe(120000);
      expect(res.amortizationSchedule[11].balance).toBe(0);
    });
  });
});
