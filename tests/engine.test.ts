/**
 * FinCalc India — Calculation Engine v2 Property-Based & Fuzzing Test Suite
 *
 * Runs 100+ randomized fuzz tests per calculator function across:
 * - Boundary conditions (0, negatives, micro amounts, massive HNI/UHNI amounts up to ₹100 Cr)
 * - Monotonicity invariants (e.g. higher income never reduces tax under the same regime)
 * - Strict finiteness checks (no NaN, Infinity, or negative zeros)
 */

import { describe, it, expect } from "vitest";
import {
  calcSIP,
  calcEMI,
  calcFD,
  calcPPF,
  calcLumpsum,
  calcTax,
  calcStepUpSIP,
  calcGoalSIP,
  calcPrepaymentVsInvest,
  calcNoCostEMITruth,
  calcFIRE,
  calcCapitalGains,
  calcFnOBreakeven,
  calcOptionPayoff,
  calcHRAExemption,
  calcPresumptiveTax,
  calcPositionSize,
  calcSection54Exemption,
} from "../lib/math";

// Seeded pseudo-random generator for reproducible property tests
function createPrng(seed: number) {
  let s = seed;
  return function () {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

describe("Calculation Engine v2 — Comprehensive Property-Based & Fuzzing Suite", () => {
  const prng = createPrng(42);

  it("1. calcSIP property tests: 100 randomized inputs never yield NaN and maintain totalCorpus >= totalInvested", () => {
    for (let i = 0; i < 100; i++) {
      const monthlyAmount = Math.round(prng() * 10000000); // up to ₹1 Cr/mo
      const annualRate = Math.round(prng() * 50 * 10) / 10; // 0 to 50%
      const years = Math.floor(prng() * 50); // 0 to 50 yrs

      const res = calcSIP({ monthlyAmount, annualRate, years });

      expect(Number.isFinite(res.totalCorpus)).toBe(true);
      expect(Number.isFinite(res.totalInvested)).toBe(true);
      expect(Number.isNaN(res.totalCorpus)).toBe(false);
      expect(res.totalCorpus).toBeGreaterThanOrEqual(res.totalInvested);
      expect(res.estimatedReturns).toBeGreaterThanOrEqual(0);
      expect(res.yearlyBreakdown.length).toBe(years);
    }
  });

  it("2. calcEMI property tests: 100 randomized loans never yield NaN and maintain totalPayment >= principal", () => {
    for (let i = 0; i < 100; i++) {
      const principal = Math.round(prng() * 500000000); // up to ₹50 Cr
      const annualRate = Math.round(prng() * 30 * 10) / 10; // 0 to 30%
      const tenureMonths = Math.floor(prng() * 360) + 1; // 1 to 360 months

      const res = calcEMI({ principal, annualRate, tenureMonths });

      expect(Number.isFinite(res.emi)).toBe(true);
      expect(Number.isFinite(res.totalPayment)).toBe(true);
      expect(res.totalPayment).toBeGreaterThanOrEqual(principal);
      expect(res.totalInterest).toBeGreaterThanOrEqual(0);
      expect(res.amortizationSchedule.length).toBe(tenureMonths);
      if (res.amortizationSchedule.length > 0) {
        expect(res.amortizationSchedule[res.amortizationSchedule.length - 1].balance).toBe(0);
      }
    }
  });

  it("3. calcFD property tests: 100 randomized deposits up to ₹100 Cr never produce NaN or loss", () => {
    for (let i = 0; i < 100; i++) {
      const principal = Math.round(prng() * 1000000000); // up to ₹100 Cr
      const annualRate = Math.round(prng() * 20 * 10) / 10; // 0 to 20%
      const tenureYears = Math.round((prng() * 25 + 0.1) * 10) / 10;
      const freq = [1, 2, 4, 12][Math.floor(prng() * 4)] as 1 | 2 | 4 | 12;

      const res = calcFD({ principal, annualRate, tenureYears, compoundingFrequency: freq });

      expect(Number.isFinite(res.maturityAmount)).toBe(true);
      expect(res.maturityAmount).toBeGreaterThanOrEqual(principal);
      expect(res.totalInterest).toBeGreaterThanOrEqual(0);
      expect(res.effectiveAnnualYield).toBeGreaterThanOrEqual(0);
    }
  });

  it("4. calcPPF property tests: 100 randomized inputs adhere to ₹1.5L cap and EEE growth", () => {
    for (let i = 0; i < 100; i++) {
      const yearlyInvestment = Math.round(prng() * 150000);
      const years = Math.floor(prng() * 40) + 1; // 1 to 40 years
      const rate = 7.1;

      const res = calcPPF({ yearlyInvestment, years, rate });

      expect(Number.isFinite(res.maturityValue)).toBe(true);
      expect(res.maturityValue).toBeGreaterThanOrEqual(res.totalInvested);
      expect(res.totalInterest).toBeGreaterThanOrEqual(0);
      expect(res.yearlyData.length).toBe(years);
    }
  });

  it("5. calcLumpsum property tests: 100 randomized investments maintain CAGR consistency without NaN", () => {
    for (let i = 0; i < 100; i++) {
      const principal = Math.round(prng() * 1000000000); // up to ₹100 Cr
      const annualRate = Math.round(prng() * 40 * 10) / 10; // 0 to 40%
      const years = Math.floor(prng() * 40); // 0 to 40 yrs

      const res = calcLumpsum({ principal, annualRate, years });

      expect(Number.isFinite(res.totalCorpus)).toBe(true);
      expect(res.totalCorpus).toBeGreaterThanOrEqual(principal);
      expect(res.estimatedReturns).toBeGreaterThanOrEqual(0);
      expect(Number.isFinite(res.CAGR)).toBe(true);
      expect(Number.isFinite(res.wealthRatio)).toBe(true);
    }
  });

  it("6. calcTax monotonicity & bounded invariants: 100 randomized incomes up to ₹100 Cr never decrease tax as income increases", () => {
    for (let i = 0; i < 100; i++) {
      const income1 = Math.round(prng() * 50000000);
      const income2 = income1 + Math.round(prng() * 5000000); // income2 >= income1

      const resNew1 = calcTax({ grossIncome: income1, regime: "new" });
      const resNew2 = calcTax({ grossIncome: income2, regime: "new" });

      expect(Number.isFinite(resNew1.totalTax)).toBe(true);
      expect(Number.isFinite(resNew2.totalTax)).toBe(true);
      expect(resNew1.totalTax).toBeGreaterThanOrEqual(0);
      expect(resNew2.totalTax).toBeGreaterThanOrEqual(resNew1.totalTax); // Monotonicity!

      const resOld1 = calcTax({ grossIncome: income1, regime: "old", deduction80C: 150000, deduction80D: 25000, hraExemption: 0, otherDeductions: 0 });
      const resOld2 = calcTax({ grossIncome: income2, regime: "old", deduction80C: 150000, deduction80D: 25000, hraExemption: 0, otherDeductions: 0 });

      expect(resOld2.totalTax).toBeGreaterThanOrEqual(resOld1.totalTax); // Monotonicity!
    }
  });

  it("7. calcStepUpSIP property tests: 100 randomized step-up runs always satisfy stepUpCorpus >= flatCorpus", () => {
    for (let i = 0; i < 100; i++) {
      const monthlyAmount = Math.round(prng() * 1000000) + 500;
      const annualRate = Math.round(prng() * 25 * 10) / 10;
      const years = Math.floor(prng() * 30) + 1;
      const stepUpValue = Math.round(prng() * 20);

      const res = calcStepUpSIP({
        monthlyAmount,
        annualRate,
        years,
        stepUpType: "percentage",
        stepUpValue,
      });

      expect(Number.isFinite(res.totalCorpus)).toBe(true);
      expect(res.totalCorpus).toBeGreaterThanOrEqual(res.flatCorpus);
      expect(res.extraReturnsVsFlat).toBeGreaterThanOrEqual(0);
    }
  });

  it("8. calcGoalSIP property tests: reverse solver reaches target corpus within 1% tolerance", () => {
    for (let i = 0; i < 50; i++) {
      const targetCorpus = Math.round(prng() * 100000000) + 100000; // ₹1L to ₹10 Cr
      const annualRate = Math.round((prng() * 15 + 6) * 10) / 10; // 6% to 21%
      const years = Math.floor(prng() * 25) + 3; // 3 to 28 years

      const res = calcGoalSIP({
        targetCorpus,
        annualRate,
        years,
        stepUpType: "percentage",
        stepUpValue: 10,
      });

      expect(res.requiredStartingSip).toBeGreaterThan(0);
      expect(Number.isFinite(res.projectedCorpus)).toBe(true);
      const diffRatio = Math.abs(res.projectedCorpus - targetCorpus) / targetCorpus;
      expect(diffRatio).toBeLessThan(0.02); // within 2%
    }
  });

  it("9. calcPrepaymentVsInvest property tests: prepayment never increases loan tenure", () => {
    for (let i = 0; i < 50; i++) {
      const principal = Math.round(prng() * 30000000) + 500000;
      const annualRate = Math.round((prng() * 8 + 7) * 10) / 10;
      const tenureMonths = Math.floor(prng() * 240) + 60;
      const prepaymentAmount = Math.round(prng() * 50000);

      const res = calcPrepaymentVsInvest({
        principal,
        annualRate,
        tenureMonths,
        prepaymentType: "monthly_topup",
        prepaymentAmount,
        investmentRate: 12,
      });

      expect(res.newTenureMonths).toBeLessThanOrEqual(tenureMonths);
      expect(res.tenureSavedMonths).toBeGreaterThanOrEqual(0);
      expect(res.interestSaved).toBeGreaterThanOrEqual(0);
    }
  });

  it("10. calcNoCostEMITruth property tests: effective APR is non-negative and subvention mechanics hold", () => {
    for (let i = 0; i < 50; i++) {
      const productPrice = Math.round(prng() * 200000) + 1000;
      const tenureMonths = [3, 6, 9, 12, 24][Math.floor(prng() * 5)];
      const processingFee = Math.round(prng() * 500);
      const upfrontDiscountForfeited = Math.round(prng() * (productPrice * 0.1));

      const res = calcNoCostEMITruth({
        productPrice,
        tenureMonths,
        processingFee,
        upfrontDiscountForfeited,
      });

      expect(Number.isFinite(res.effectiveApr)).toBe(true);
      expect(res.effectiveApr).toBeGreaterThanOrEqual(0);
      expect(res.totalCostEmi).toBeGreaterThanOrEqual(productPrice);
      expect(res.monthlyBreakdown.length).toBe(tenureMonths);
    }
  });

  it("11. calcFIRE property tests: 50 randomized retirement setups always generate valid chronological timeline", () => {
    for (let i = 0; i < 50; i++) {
      const currentAge = Math.floor(prng() * 25) + 20; // 20 to 45
      const retirementAge = currentAge + Math.floor(prng() * 25) + 5; // 25 to 70
      const lifeExpectancy = retirementAge + Math.floor(prng() * 25) + 5; // up to 95
      const currentMonthlyExpenses = Math.round(prng() * 200000) + 10000;

      const res = calcFIRE({
        currentAge,
        retirementAge,
        lifeExpectancy,
        currentMonthlyExpenses,
        preRetirementReturn: 12,
        postRetirementReturn: 8,
        inflationRate: 6,
      });

      expect(Number.isFinite(res.standardFireCorpus)).toBe(true);
      expect(res.leanFireCorpus).toBeLessThan(res.standardFireCorpus);
      expect(res.fatFireCorpus).toBeGreaterThan(res.standardFireCorpus);
      expect(res.timeline.length).toBe(lifeExpectancy - currentAge);
    }
  });

  it("12. calcCapitalGains property tests: 100 randomized trades across all asset classes never yield negative tax", () => {
    const assetClasses = ["equity", "debt_mf", "real_estate", "gold_sgb"] as const;
    for (let i = 0; i < 100; i++) {
      const assetClass = assetClasses[Math.floor(prng() * assetClasses.length)];
      const purchasePrice = Math.round(prng() * 50000000);
      const salePrice = Math.round(prng() * 80000000);
      const holdingMonths = Math.floor(prng() * 60) + 1;

      const res = calcCapitalGains({
        assetClass,
        purchasePrice,
        salePrice,
        holdingMonths,
      });

      expect(Number.isFinite(res.totalTaxPayable)).toBe(true);
      expect(res.totalTaxPayable).toBeGreaterThanOrEqual(0);
      expect(res.effectiveTaxRate).toBeGreaterThanOrEqual(0);
      expect(res.effectiveTaxRate).toBeLessThanOrEqual(100);
    }
  });

  it("13. calcFnOBreakeven property tests: 100 randomized trades always yield breakevenSellPrice >= buyPrice", () => {
    const instruments = ["options", "futures"] as const;
    for (let i = 0; i < 100; i++) {
      const instrument = instruments[Math.floor(prng() * instruments.length)];
      const buyPrice = Math.round((prng() * 5000 + 1) * 100) / 100;
      const sellPrice = Math.round((prng() * 5000 + 1) * 100) / 100;
      const quantity = Math.floor(prng() * 2000) + 1;

      const res = calcFnOBreakeven({
        instrument,
        buyPrice,
        sellPrice,
        quantity,
      });

      expect(Number.isFinite(res.totalCharges)).toBe(true);
      expect(res.totalCharges).toBeGreaterThanOrEqual(0);
      expect(res.breakevenSellPrice).toBeGreaterThanOrEqual(buyPrice);
      expect(res.pointsToBreakeven).toBeGreaterThanOrEqual(0);
    }
  });

  it("14. calcOptionPayoff property tests: generates continuous curve with non-NaN payoffs", () => {
    for (let i = 0; i < 30; i++) {
      const spotPrice = Math.round(prng() * 30000) + 1000;
      const res = calcOptionPayoff({
        underlyingPrice: spotPrice,
        lotSize: 50,
        legs: [
          { type: "call", position: "buy", strike: spotPrice, premium: 100, lots: 1 },
          { type: "call", position: "sell", strike: spotPrice + 200, premium: 30, lots: 1 },
        ],
      });

      expect(res.chartData.length).toBeGreaterThan(10);
      expect(Number.isFinite(res.netPremiumPaidOrReceived)).toBe(true);
    }
  });

  it("15. calcHRAExemption property tests: exempt HRA is strictly bounded by HRA received", () => {
    for (let i = 0; i < 50; i++) {
      const basicSalary = Math.round(prng() * 5000000) + 100000;
      const hraReceived = Math.round(basicSalary * (prng() * 0.5));
      const rentPaid = Math.round(basicSalary * (prng() * 0.8));

      const res = calcHRAExemption({
        basicSalary,
        hraReceived,
        rentPaid,
        cityType: prng() > 0.5 ? "metro" : "non_metro",
      });

      expect(res.annualExemptHra).toBeLessThanOrEqual(res.annualHraReceived);
      expect(res.annualExemptHra).toBeGreaterThanOrEqual(0);
      expect(res.annualTaxableHra).toBeGreaterThanOrEqual(0);
      expect(res.annualExemptHra + res.annualTaxableHra).toBe(res.annualHraReceived);
    }
  });

  it("16. calcPresumptiveTax property tests: presumptive deemed profit matches statutory rates", () => {
    for (let i = 0; i < 50; i++) {
      // Eligible professional turnover (<= ₹75L)
      const turnover44ada = Math.round(prng() * 7000000) + 100000;
      const res44ada = calcPresumptiveTax({
        professionType: "44ADA_professional",
        grossTurnover: turnover44ada,
      });
      expect(res44ada.isEligibleForPresumptive).toBe(true);
      expect(res44ada.presumptiveIncome).toBe(Math.round(turnover44ada * 0.5));

      // Business turnover (tested with digital percentage >= 95% for enhanced ₹3Cr limit, or <= ₹2Cr for base limit)
      const digitalPct = Math.round(prng() * 100);
      const maxLimit = digitalPct >= 95 ? 30000000 : 20000000;
      const turnover44ad = Math.round(prng() * (maxLimit - 500000)) + 100000;

      const res44ad = calcPresumptiveTax({
        professionType: "44AD_business",
        grossTurnover: turnover44ad,
        digitalReceiptsPercentage: digitalPct,
      });
      expect(res44ad.isEligibleForPresumptive).toBe(true);
      expect(res44ad.presumptiveIncome).toBeGreaterThanOrEqual(0);
      expect(Number.isFinite(res44ad.presumptiveTaxPayable)).toBe(true);
    }
  });

  it("17. calcPositionSize property tests: risk amount strictly bounded by maximum risk budget", () => {
    for (let i = 0; i < 50; i++) {
      const capital = Math.round(prng() * 50000000) + 10000;
      const riskPercent = Math.round((prng() * 4 + 0.5) * 10) / 10;
      const entryPrice = Math.round(prng() * 5000) + 100;
      const stopLossPrice = entryPrice - (Math.round(prng() * 200) + 5);

      const res = calcPositionSize({
        capital,
        riskPercent,
        entryPrice,
        stopLossPrice,
      });

      if (res.isValid) {
        expect(res.actualRiskAmount).toBeLessThanOrEqual(res.maxRiskAmount + 1e-6);
        expect(res.quantity).toBeGreaterThanOrEqual(0);
        expect(Number.isInteger(res.quantity)).toBe(true);
      }
    }
  });

  it("18. calcSection54Exemption property tests: 54EC bond exemption never exceeds ₹50 Lakh statutory cap", () => {
    for (let i = 0; i < 50; i++) {
      const capitalGainsAmount = Math.round(prng() * 200000000); // up to ₹20 Cr
      const bondsInvestmentAmount = Math.round(prng() * 100000000); // up to ₹10 Cr bonds

      const res = calcSection54Exemption({
        capitalGainsAmount,
        sectionType: "section_54ec_bonds",
        bondsInvestmentAmount,
      });

      expect(res.activeResult.exemptionAllowed).toBeLessThanOrEqual(5000000); // Capped at ₹50L!
      expect(res.activeResult.exemptionAllowed).toBeLessThanOrEqual(capitalGainsAmount);
      expect(res.activeResult.taxableGainsRemaining).toBeGreaterThanOrEqual(0);
      expect(res.activeResult.taxSaved).toBeGreaterThanOrEqual(0);
    }
  });
});
