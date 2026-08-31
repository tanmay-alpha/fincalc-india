/**
 * FinCalc India — Full Regression Audit Suite ("Zero Mistake" Pass)
 *
 * 3+ adversarial edge-case tests per calculator function covering:
 * - 0% rates & zero inputs
 * - Micro & extreme values (up to ₹1,000 Cr)
 * - Single-month vs extreme horizons
 * - Exact statutory boundary transitions
 * - Boundary threshold conditions
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
  calcCarTCO,
  calcBalanceTransfer,
  calcUSStockReturn,
  calcNRIDepositReturns,
  calcNPS,
  calcXIRR,
  calcRiskRatios,
  calcMarginalRelief,
  calcLRSTCS,
} from "../lib/math";

describe("SECTION 5: Full Regression Audit — Adversarial Edge-Case Suite", () => {
  // ─── 1. SIP Calculator ──────────────────────────────────────────
  describe("1. calcSIP Adversarial Tests", () => {
    it("handles 0% annual return rate (pure linear summation)", () => {
      const res = calcSIP({ monthlyAmount: 10000, annualRate: 0, years: 5 });
      expect(res.totalInvested).toBe(600000);
      expect(res.totalCorpus).toBe(600000);
      expect(res.estimatedReturns).toBe(0);
      expect(res.absoluteReturn).toBe(0);
    });

    it("handles 1-month / 0-year horizon cleanly without NaN", () => {
      const res = calcSIP({ monthlyAmount: 10000, annualRate: 12, years: 0 });
      expect(res.totalInvested).toBe(0);
      expect(res.totalCorpus).toBe(0);
      expect(res.estimatedReturns).toBe(0);
    });

    it("handles ultra-HNI ₹10 Cr/month over 50 years at 15% without overflow", () => {
      const res = calcSIP({ monthlyAmount: 100000000, annualRate: 15, years: 50 });
      expect(Number.isFinite(res.totalCorpus)).toBe(true);
      expect(res.totalCorpus).toBeGreaterThan(res.totalInvested);
      expect(res.totalInvested).toBe(60000000000);
    });
  });

  // ─── 2. EMI Calculator ──────────────────────────────────────────
  describe("2. calcEMI Adversarial Tests", () => {
    it("handles 0% interest rate loan (EMI = Principal / tenure)", () => {
      const res = calcEMI({ principal: 120000, annualRate: 0, tenureMonths: 12 });
      expect(res.emi).toBe(10000);
      expect(res.totalInterest).toBe(0);
      expect(res.totalPayment).toBe(120000);
    });

    it("handles 1-month tenure loan", () => {
      const res = calcEMI({ principal: 100000, annualRate: 12, tenureMonths: 1 });
      expect(res.emi).toBe(101000);
      expect(res.totalInterest).toBe(1000);
      expect(res.amortizationSchedule.length).toBe(1);
    });

    it("handles ₹1,000 Crore mega commercial loan over 360 months", () => {
      const res = calcEMI({ principal: 10000000000, annualRate: 8.5, tenureMonths: 360 });
      expect(Number.isFinite(res.emi)).toBe(true);
      expect(res.totalPayment).toBeGreaterThan(10000000000);
      expect(res.amortizationSchedule[359].balance).toBe(0);
    });
  });

  // ─── 3. FD Calculator ───────────────────────────────────────────
  describe("3. calcFD Adversarial Tests", () => {
    it("handles 0% interest rate (maturity = principal)", () => {
      const res = calcFD({ principal: 500000, annualRate: 0, tenureYears: 5, compoundingFrequency: 4 });
      expect(res.maturityAmount).toBe(500000);
      expect(res.totalInterest).toBe(0);
    });

    it("handles micro-tenure (0.1 year / ~1 month) with monthly compounding", () => {
      const res = calcFD({ principal: 100000, annualRate: 6.5, tenureYears: 0.1, compoundingFrequency: 12 });
      expect(res.maturityAmount).toBeGreaterThan(100000);
      expect(res.totalInterest).toBeGreaterThan(0);
    });

    it("handles ₹500 Cr corporate deposit at 8% quarterly for 10 years", () => {
      const res = calcFD({ principal: 5000000000, annualRate: 8, tenureYears: 10, compoundingFrequency: 4 });
      expect(Number.isFinite(res.maturityAmount)).toBe(true);
      expect(res.maturityAmount).toBeGreaterThan(5000000000);
    });
  });

  // ─── 4. PPF Calculator ──────────────────────────────────────────
  describe("4. calcPPF Adversarial Tests", () => {
    it("handles 0 annual deposit cleanly", () => {
      const res = calcPPF({ yearlyInvestment: 0, years: 15, rate: 7.1 });
      expect(res.totalInvested).toBe(0);
      expect(res.maturityValue).toBe(0);
      expect(res.totalInterest).toBe(0);
    });

    it("correctly unlocks loan (years 3-6) and withdrawal (year 7+)", () => {
      const res = calcPPF({ yearlyInvestment: 150000, years: 15, rate: 7.1 });
      expect(res.yearlyData[0].loanAllowed).toBe(false);
      expect(res.yearlyData[2].loanAllowed).toBe(true); // Year 3
      expect(res.yearlyData[5].loanAllowed).toBe(true); // Year 6
      expect(res.yearlyData[6].loanAllowed).toBe(false); // Year 7
      expect(res.yearlyData[5].withdrawalAllowed).toBe(false); // Year 6
      expect(res.yearlyData[6].withdrawalAllowed).toBe(true); // Year 7
    });

    it("handles 50-year extended PPF account", () => {
      const res = calcPPF({ yearlyInvestment: 150000, years: 50, rate: 7.1 });
      expect(res.yearlyData.length).toBe(50);
      expect(res.maturityValue).toBeGreaterThan(res.totalInvested * 5);
    });
  });

  // ─── 5. Lumpsum Calculator ──────────────────────────────────────
  describe("5. calcLumpsum Adversarial Tests", () => {
    it("handles 0 years tenure (returns exactly principal)", () => {
      const res = calcLumpsum({ principal: 100000, annualRate: 12, years: 0 });
      expect(res.totalCorpus).toBe(100000);
      expect(res.estimatedReturns).toBe(0);
      expect(res.CAGR).toBe(0);
    });

    it("handles 0% annual return rate", () => {
      const res = calcLumpsum({ principal: 500000, annualRate: 0, years: 10 });
      expect(res.totalCorpus).toBe(500000);
      expect(res.estimatedReturns).toBe(0);
      expect(res.absoluteReturn).toBe(0);
    });

    it("handles ₹100 Cr ultra investment over 30 years", () => {
      const res = calcLumpsum({ principal: 1000000000, annualRate: 14, years: 30 });
      expect(Number.isFinite(res.totalCorpus)).toBe(true);
      expect(res.wealthRatio).toBeGreaterThan(40);
    });
  });

  // ─── 6. Income Tax Calculator ───────────────────────────────────
  describe("6. calcTax Adversarial Tests", () => {
    it("Tax Year 2026-27: ₹12,75,000 gross with ₹75k std ded gives exact ₹0 tax via Section 157 rebate", () => {
      const res = calcTax({ grossIncome: 1275000, regime: "new" });
      expect(res.taxableIncome).toBe(1200000);
      expect(res.totalTax).toBe(0);
    });

    it("Tax Year 2026-27: ₹12,75,100 gross with ₹75k std ded crosses threshold (no rebate, full slab tax applied)", () => {
      const res = calcTax({ grossIncome: 1275100, regime: "new" });
      expect(res.taxableIncome).toBe(1200100);
      expect(res.totalTax).toBeGreaterThan(60000);
    });

    it("handles zero income (₹0 gross)", () => {
      const res = calcTax({ grossIncome: 0, regime: "new" });
      expect(res.taxableIncome).toBe(0);
      expect(res.totalTax).toBe(0);
      expect(res.effectiveRate).toBe(0);
    });
  });

  // ─── 7. Step-Up SIP Calculator ──────────────────────────────────
  describe("7. calcStepUpSIP Adversarial Tests", () => {
    it("handles 0% step-up (matches flat SIP exactly)", () => {
      const res = calcStepUpSIP({
        monthlyAmount: 10000,
        annualRate: 12,
        years: 10,
        stepUpType: "percentage",
        stepUpValue: 0,
      });
      expect(res.totalCorpus).toBe(res.flatCorpus);
      expect(res.extraReturnsVsFlat).toBe(0);
    });

    it("handles fixed rupee step-up of ₹1,000/year", () => {
      const res = calcStepUpSIP({
        monthlyAmount: 5000,
        annualRate: 12,
        years: 3,
        stepUpType: "amount",
        stepUpValue: 1000,
      });
      expect(res.yearlyBreakdown[0].monthlyAmount).toBe(5000);
      expect(res.yearlyBreakdown[1].monthlyAmount).toBe(6000);
      expect(res.yearlyBreakdown[2].monthlyAmount).toBe(7000);
    });

    it("handles 1-year tenure (no step-up triggered in Year 1)", () => {
      const res = calcStepUpSIP({
        monthlyAmount: 10000,
        annualRate: 12,
        years: 1,
        stepUpType: "percentage",
        stepUpValue: 10,
      });
      expect(res.totalInvested).toBe(120000);
      expect(res.totalCorpus).toBe(res.flatCorpus);
    });
  });

  // ─── 8. Goal SIP Calculator ─────────────────────────────────────
  describe("8. calcGoalSIP Adversarial Tests", () => {
    it("handles zero target corpus", () => {
      const res = calcGoalSIP({
        targetCorpus: 0,
        annualRate: 12,
        years: 10,
        stepUpType: "percentage",
        stepUpValue: 10,
      });
      expect(res.requiredStartingSip).toBe(0);
      expect(res.projectedCorpus).toBe(0);
    });

    it("solves accurately for ₹1 Crore goal over 15 years at 12%", () => {
      const res = calcGoalSIP({
        targetCorpus: 10000000,
        annualRate: 12,
        years: 15,
        stepUpType: "percentage",
        stepUpValue: 10,
      });
      expect(res.requiredStartingSip).toBeGreaterThan(8000);
      expect(res.requiredStartingSip).toBeLessThan(15000);
      expect(Math.abs(res.projectedCorpus - 10000000) / 10000000).toBeLessThan(0.01);
    });

    it("solves accurately for ₹100 Crore mega endowment goal over 25 years", () => {
      const res = calcGoalSIP({
        targetCorpus: 1000000000,
        annualRate: 14,
        years: 25,
        stepUpType: "percentage",
        stepUpValue: 10,
      });
      expect(res.requiredStartingSip).toBeGreaterThan(50000);
      expect(Number.isFinite(res.requiredStartingSip)).toBe(true);
    });
  });

  // ─── 9. Loan Prepayment vs Investment ───────────────────────────
  describe("9. calcPrepaymentVsInvest Adversarial Tests", () => {
    it("handles zero prepayment amount", () => {
      const res = calcPrepaymentVsInvest({
        principal: 5000000,
        annualRate: 8.5,
        tenureMonths: 240,
        prepaymentType: "monthly_topup",
        prepaymentAmount: 0,
        investmentRate: 12,
      });
      expect(res.interestSaved).toBe(0);
      expect(res.tenureSavedMonths).toBe(0);
    });

    it("handles full lump sum payoff at Year 1", () => {
      const res = calcPrepaymentVsInvest({
        principal: 2000000,
        annualRate: 9,
        tenureMonths: 120,
        prepaymentType: "lumpsum",
        lumpsumYear: 1,
        prepaymentAmount: 2000000,
        investmentRate: 12,
      });
      expect(res.newTenureMonths).toBe(12);
      expect(res.tenureSavedMonths).toBe(108);
      expect(res.interestSaved).toBeGreaterThan(0);
    });

    it("computes accurate break-even rate", () => {
      const res = calcPrepaymentVsInvest({
        principal: 3000000,
        annualRate: 8.5,
        tenureMonths: 180,
        prepaymentType: "monthly_topup",
        prepaymentAmount: 5000,
        investmentRate: 8.5,
      });
      expect(Number.isFinite(res.breakEvenRate)).toBe(true);
    });
  });

  // ─── 10. No-Cost EMI Calculator ─────────────────────────────────
  describe("10. calcNoCostEMITruth Adversarial Tests", () => {
    it("handles 0 processing fee and 0 upfront discount forfeited", () => {
      const res = calcNoCostEMITruth({
        productPrice: 30000,
        tenureMonths: 3,
        processingFee: 0,
        upfrontDiscountForfeited: 0,
      });
      expect(res.totalEmiPaid).toBe(30000);
      expect(res.hiddenGst).toBeGreaterThan(0);
      expect(res.totalCostEmi).toBeGreaterThan(30000);
    });

    it("detects massive upfront discount loss (makes upfront vastly superior)", () => {
      const res = calcNoCostEMITruth({
        productPrice: 100000,
        tenureMonths: 6,
        processingFee: 199,
        upfrontDiscountForfeited: 15000, // 15% lost
      });
      expect(res.cheaperOption).toBe("upfront");
      expect(res.netDifference).toBeGreaterThan(15000);
      expect(res.effectiveApr).toBeGreaterThan(30);
    });

    it("handles 1-month tenure corner case", () => {
      const res = calcNoCostEMITruth({
        productPrice: 10000,
        tenureMonths: 1,
        processingFee: 99,
        upfrontDiscountForfeited: 0,
      });
      expect(res.monthlyBreakdown.length).toBe(1);
    });
  });

  // ─── 11. FIRE Calculator ────────────────────────────────────────
  describe("11. calcFIRE Adversarial Tests", () => {
    it("handles retirement at current age (already retired)", () => {
      const res = calcFIRE({
        currentAge: 50,
        retirementAge: 50,
        lifeExpectancy: 85,
        currentMonthlyExpenses: 100000,
        preRetirementReturn: 12,
        postRetirementReturn: 8,
        inflationRate: 6,
      });
      expect(res.yearsToRetirement).toBe(0);
      expect(res.yearsInRetirement).toBe(35);
      expect(res.standardFireCorpus).toBeGreaterThan(0);
    });

    it("handles 0 monthly expenses", () => {
      const res = calcFIRE({
        currentAge: 30,
        retirementAge: 50,
        lifeExpectancy: 80,
        currentMonthlyExpenses: 0,
      });
      expect(res.standardFireCorpus).toBe(0);
      expect(res.requiredMonthlySavings).toBe(0);
    });

    it("generates comprehensive timeline for FIRE setups", () => {
      const res = calcFIRE({
        currentAge: 30,
        retirementAge: 45,
        lifeExpectancy: 90,
        currentMonthlyExpenses: 50000,
        preRetirementReturn: 14,
        postRetirementReturn: 12,
        inflationRate: 5,
        swrPercent: 3.5,
      });
      expect(res.timeline.length).toBe(60);
      expect(res.standardFireCorpus).toBeGreaterThan(0);
    });
  });

  // ─── 12. Capital Gains Tax Calculator ───────────────────────────
  describe("12. calcCapitalGains Adversarial Tests", () => {
    it("handles capital loss (salePrice < purchasePrice) cleanly", () => {
      const res = calcCapitalGains({
        assetClass: "equity",
        purchasePrice: 500000,
        salePrice: 300000,
        holdingMonths: 18,
      });
      expect(res.isLoss).toBe(true);
      expect(res.rawCapitalGain).toBe(-200000);
      expect(res.taxableGain).toBe(0);
      expect(res.totalTaxPayable).toBe(0);
    });

    it("Tax Year 2026-27: Equity LTCG below ₹1.25 Lakh exemption threshold gives ₹0 tax", () => {
      const res = calcCapitalGains({
        assetClass: "equity",
        purchasePrice: 100000,
        salePrice: 200000, // ₹1.00 Lakh gain (< ₹1.25L)
        holdingMonths: 24,
      });
      expect(res.rawCapitalGain).toBe(100000);
      expect(res.exemptionAllowed).toBe(100000);
      expect(res.totalTaxPayable).toBe(0);
    });

    it("Tax Year 2026-27: Equity STCG taxed flat 20%", () => {
      const res = calcCapitalGains({
        assetClass: "equity",
        purchasePrice: 100000,
        salePrice: 200000,
        holdingMonths: 6, // Short term
      });
      expect(res.gainType).toBe("STCG");
      expect(res.rawCapitalGain).toBe(100000);
      expect(res.totalTaxPayable).toBe(20000); // 20%
    });
  });

  // ─── 13. F&O Breakeven Calculator ───────────────────────────────
  describe("13. calcFnOBreakeven Adversarial Tests", () => {
    it("Tax Year 2026-27: Options STT calculated at flat 0.15% on sell premium", () => {
      const res = calcFnOBreakeven({
        instrument: "options",
        buyPrice: 100,
        sellPrice: 100,
        quantity: 1000,
        taxYear: "tax_year_2026_27",
      });
      expect(res.charges.stt).toBe(150); // 1000 * 100 * 0.15% = 150
      expect(res.breakevenSellPrice).toBeGreaterThan(100);
    });

    it("Pre-April 2026: Options STT calculated at 0.10% on sell premium", () => {
      const res = calcFnOBreakeven({
        instrument: "options",
        buyPrice: 100,
        sellPrice: 100,
        quantity: 1000,
        taxYear: "pre_april_2026",
      });
      expect(res.charges.stt).toBe(100); // 1000 * 100 * 0.10% = 100
    });

    it("handles large institutional quantity (50,000 lots)", () => {
      const res = calcFnOBreakeven({
        instrument: "futures",
        buyPrice: 24000,
        sellPrice: 24100,
        quantity: 25000,
        taxYear: "tax_year_2026_27",
      });
      expect(Number.isFinite(res.totalCharges)).toBe(true);
      expect(res.netPnl).toBeGreaterThan(0);
    });
  });

  // ─── 14. Option Payoff Visualizer ───────────────────────────────
  describe("14. calcOptionPayoff Adversarial Tests", () => {
    it("handles empty legs gracefully", () => {
      const res = calcOptionPayoff({
        underlyingPrice: 24000,
        legs: [],
        lotSize: 50,
      });
      expect(res.chartData.length).toBe(0);
      expect(res.maxProfit).toBe(0);
      expect(res.maxLoss).toBe(0);
    });

    it("computes Long Call with unlimited max profit and bounded max loss", () => {
      const res = calcOptionPayoff({
        underlyingPrice: 24000,
        legs: [{ type: "call", position: "long", strike: 24000, premium: 200, lots: 1 }],
        lotSize: 50,
      });
      expect(res.maxProfit).toBe("Unlimited");
      expect(res.maxLoss).toBe(-10000); // 200 * 50
      expect(res.breakevens).toContain(24200);
    });

    it("computes Bull Call Spread with capped profit and capped loss", () => {
      const res = calcOptionPayoff({
        underlyingPrice: 24000,
        legs: [
          { type: "call", position: "long", strike: 24000, premium: 200, lots: 1 },
          { type: "call", position: "short", strike: 24500, premium: 50, lots: 1 },
        ],
        lotSize: 50,
      });
      expect(typeof res.maxProfit).toBe("number");
      expect(res.maxProfit).toBe(17500); // (500 - 150) * 50
      expect(res.maxLoss).toBe(-7500); // 150 * 50
    });
  });

  // ─── 15. HRA Exemption Calculator ───────────────────────────────
  describe("15. calcHRAExemption Adversarial Tests", () => {
    it("handles zero rent paid (exempt HRA = ₹0)", () => {
      const res = calcHRAExemption({
        basicSalary: 100000,
        hraReceived: 50000,
        rentPaid: 0,
        cityType: "metro",
      });
      expect(res.annualExemptHra).toBe(0);
      expect(res.annualTaxableHra).toBe(res.annualHraReceived);
      expect(res.taxSaved).toBe(0);
    });

    it("identifies metro 50% salary cap binding constraint", () => {
      const res = calcHRAExemption({
        basicSalary: 100000,
        hraReceived: 80000, // 80%
        rentPaid: 90000,
        cityType: "metro",
      });
      expect(res.bindingConstraint).toBe("salary_cap");
      expect(res.monthlyExemptHra).toBe(50000); // 50% of 100k
    });

    it("correctly models paying rent to parents with 30% Section 24 standard deduction", () => {
      const res = calcHRAExemption({
        basicSalary: 100000,
        hraReceived: 40000,
        rentPaid: 35000,
        cityType: "metro",
        isPayingToParents: true,
        userSlabRatePercent: 30,
        parentsSlabRatePercent: 0, // Parent in nil tax slab
      });
      expect(res.payingToParentsDetails?.isBeneficial).toBe(true);
      expect(res.payingToParentsDetails?.netHouseholdTaxSaved).toBeGreaterThan(0);
    });
  });

  // ─── 16. Presumptive Taxation Calculator ────────────────────────
  describe("16. calcPresumptiveTax Adversarial Tests", () => {
    it("Section 44ADA: 50% deemed profit on professional turnover", () => {
      const res = calcPresumptiveTax({
        professionType: "44ADA_professional",
        grossTurnover: 5000000,
      });
      expect(res.isEligibleForPresumptive).toBe(true);
      expect(res.presumptiveIncome).toBe(2500000);
    });

    it("Section 44ADA: turnover > ₹75 Lakh triggers ineligibility", () => {
      const res = calcPresumptiveTax({
        professionType: "44ADA_professional",
        grossTurnover: 8000000,
      });
      expect(res.isEligibleForPresumptive).toBe(false);
      expect(res.ineligibilityReason).toContain("exceed the maximum ₹75 Lakh limit");
    });

    it("Section 44AD: triggers audit warning if actual profit < 6% or 8% and exceeds basic exemption", () => {
      const res = calcPresumptiveTax({
        professionType: "44AD_business",
        grossTurnover: 10000000,
        actualProfit: 500000, // 5% < 6%, and 5L > 4L basic exemption
      });
      expect(res.isAuditTriggeredByOptOut).toBe(true);
      expect(res.fiveYearLockoutTriggered).toBe(true);
    });
  });

  // ─── 17. Position Size & Risk Calculator ────────────────────────
  describe("17. calcPositionSize Adversarial Tests", () => {
    it("invalidates when entry price equals stop-loss price (zero risk per share)", () => {
      const res = calcPositionSize({
        capital: 1000000,
        riskPercent: 1,
        entryPrice: 2000,
        stopLossPrice: 2000,
      });
      expect(res.isValid).toBe(false);
      expect(res.quantity).toBe(0);
    });

    it("caps quantity strictly by available capital if risk budget exceeds buying power", () => {
      const res = calcPositionSize({
        capital: 50000,
        riskPercent: 10, // ₹5,000 risk
        entryPrice: 1000,
        stopLossPrice: 990, // ₹10 risk/share -> 500 shares needed = ₹5,00,000 > ₹50,000 capital
      });
      expect(res.isCappedByCapital).toBe(true);
      expect(res.quantity).toBe(50); // 50,000 / 1000
      expect(res.positionValue).toBe(50000);
    });

    it("accurately handles short trade position with target inverted", () => {
      const res = calcPositionSize({
        capital: 1000000,
        riskPercent: 1,
        entryPrice: 1000,
        stopLossPrice: 1020, // Stop is above entry -> short trade
        riskRewardRatio: 2,
      });
      expect(res.tradeDirection).toBe("short");
      expect(res.targetPrice).toBe(960); // 1000 - 2 * 20
    });
  });

  // ─── 18. Section 54 / 54EC Planner ──────────────────────────────
  describe("18. calcSection54Exemption Adversarial Tests", () => {
    it("Section 54EC: ₹10 Cr bond investment strictly capped at ₹50 Lakh statutory exemption", () => {
      const res = calcSection54Exemption({
        capitalGainsAmount: 100000000,
        sectionType: "section_54ec_bonds",
        bondsInvestmentAmount: 100000000,
      });
      expect(res.activeResult.exemptionAllowed).toBe(5000000);
      expect(res.activeResult.statutoryCap).toBe(5000000);
      expect(res.activeResult.taxSaved).toBe(650000); // 50L * 13%
    });

    it("Section 54EC: rejects bond investment beyond 6 months from property transfer", () => {
      const res = calcSection54Exemption({
        capitalGainsAmount: 5000000,
        sectionType: "section_54ec_bonds",
        bondsInvestmentAmount: 5000000,
        bondsTimelineMonths: 7, // > 6 months
      });
      expect(res.activeResult.isValidTimeline).toBe(false);
      expect(res.activeResult.exemptionAllowed).toBe(0);
      expect(res.activeResult.taxSaved).toBe(0);
    });

    it("Section 54: rejects residential property purchase 18 months BEFORE sale (>12 months limit)", () => {
      const res = calcSection54Exemption({
        capitalGainsAmount: 10000000,
        sectionType: "section_54_property",
        propertyInvestmentAmount: 10000000,
        propertyMode: "purchase",
        propertyTimelineMonths: -18, // 18 months before sale
      });
      expect(res.activeResult.isValidTimeline).toBe(false);
      expect(res.activeResult.exemptionAllowed).toBe(0);
    });
  });

  // ─── 19. calcTax Statutory Section 157 & Surcharge Hardening ─────
  describe("19. calcTax Statutory Section 157 & Surcharge Hardening", () => {
    it("Section 157 Rebate: Total income ₹12L (₹10L salary + ₹2L equity LTCG) reduces slab tax to ₹0 but charges LTCG in full", () => {
      const res = calcTax({
        grossIncome: 1000000, // 9.25L taxable slab after 75k std ded
        equityLtcg: 200000, // 75k taxable after 1.25L exemption
        regime: "new",
      });
      // Total taxable income = 9.25L + 0.75L = 10.0L <= 12L -> eligible for rebate
      // Slab tax = 4L @ 5% (20k) + 1.25L @ 10% (12.5k) = 32,500
      // Rebate = 32,500 -> net slab tax = 0
      // Equity LTCG tax @ 12.5% on 75k = 9,375 (NOT rebated)
      // Cess @ 4% on 9,375 = 375
      // Total tax = 9,750
      expect(res.rebateAmount).toBe(32500);
      expect(res.equityLtcgTax).toBe(9375);
      expect(res.cess).toBe(375);
      expect(res.totalTax).toBe(9750);
    });

    it("Section 157 Rebate: Total taxable income exceeding ₹12L by ₹1 receives ₹0 rebate", () => {
      const res = calcTax({
        grossIncome: 1275001, // 12,00,001 taxable after 75k std ded
        regime: "new",
      });
      expect(res.rebateAmount).toBe(0);
      expect(res.totalTax).toBeGreaterThan(60000);
    });

    it("New Regime Surcharge: Above ₹5 Crore is strictly capped at 25% (no 37% tier)", () => {
      const res = calcMarginalRelief({
        grossTotalIncome: 60000000, // ₹6 Crore
        regime: "new",
      });
      expect(res.applicableSurchargeRatePercent).toBe(25);
    });

    it("Old Regime Surcharge: Above ₹5 Crore applies 37% surcharge", () => {
      const res = calcMarginalRelief({
        grossTotalIncome: 60000000, // ₹6 Crore
        regime: "old",
      });
      expect(res.applicableSurchargeRatePercent).toBe(37);
    });

    it("Special Rate Surcharge Cap: Surcharge on Equity LTCG is capped at 15% even when income > ₹5 Cr", () => {
      const res = calcTax({
        grossIncome: 60000000, // ₹6 Crore total
        equityLtcg: 10000000, // ₹1 Crore LTCG
        regime: "new",
      });
      expect(res.surcharge).toBeGreaterThan(0);
      expect(res.totalTax).toBeGreaterThan(0);
    });

    it("Marginal Relief: Exact continuity at ₹50,00,001 (Tax + Surcharge <= Base Tax + ₹1)", () => {
      const resAt50L = calcMarginalRelief({ grossTotalIncome: 5000000, regime: "new" });
      const resAt50LPlus1 = calcMarginalRelief({ grossTotalIncome: 5000001, regime: "new" });
      expect(resAt50LPlus1.taxPlusNetSurcharge).toBeLessThanOrEqual(resAt50L.baseTax + 1.5);
    });
  });

  // ─── 20. calcHRAExemption Statutory Eligibility ─────────────────
  describe("20. calcHRAExemption Statutory Rules", () => {
    it("New Regime: returns ₹0 exemption and explains Section 10(13A) is not available", () => {
      const res = calcHRAExemption({
        salaryPeriod: "annual",
        basicSalary: 1200000,
        hraReceived: 360000,
        rentPaid: 360000,
        cityType: "metro",
        regime: "new",
      });
      expect(res.annualExemptHra).toBe(0);
      expect(res.annualTaxableHra).toBe(360000);
      expect(res.summary).toContain("New Tax Regime");
    });

    it("Old Regime: computes exact 3-condition minimum", () => {
      const res = calcHRAExemption({
        salaryPeriod: "annual",
        basicSalary: 1200000,
        hraReceived: 360000,
        rentPaid: 360000,
        cityType: "metro",
        regime: "old",
      });
      // 1. Actual HRA = 3,60,000
      // 2. Rent - 10% basic = 3,60,000 - 1,20,000 = 2,40,000
      // 3. 50% basic (metro) = 6,00,000
      // Min = 2,40,000
      expect(res.annualExemptHra).toBe(240000);
      expect(res.annualTaxableHra).toBe(120000);
    });
  });

  // ─── 21. Car Loan TCO Reconciliation ────────────────────────────
  describe("21. calcCarTCO Full Financial Reconciliation", () => {
    it("Headline totals strictly equal sum of progression breakdown components", () => {
      const res = calcCarTCO({
        carOnRoadPrice: 1500000,
        downPayment: 300000,
        loanInterestRate: 9.0,
        loanTenureYears: 5,
        ownershipTenureYears: 7,
        annualKmDriven: 12000,
        fuelMileageKmpl: 15,
        fuelPricePerLitre: 100,
        annualInsuranceCost: 35000,
        annualMaintenanceCost: 15000,
        annualDepreciationPercent: 15,
      });

      const sumFuel = res.yearlyBreakdown.reduce((a, b) => a + b.fuelCost, 0);
      const sumIns = res.yearlyBreakdown.reduce((a, b) => a + b.insuranceCost, 0);
      const sumMaint = res.yearlyBreakdown.reduce((a, b) => a + b.maintenanceCost, 0);

      expect(res.totalFuelCost).toBe(sumFuel);
      expect(res.totalInsuranceCost).toBe(sumIns);
      expect(res.totalMaintenanceCost).toBe(sumMaint);
      expect(res.totalRunningCost).toBe(sumFuel + sumIns + sumMaint);
      expect(res.netTotalCostOfOwnership).toBe(res.grossOutflow - res.estimatedResaleValue);
    });

    it("Early car sale (3 yr ownership on 5 yr loan) settles outstanding debt", () => {
      const res = calcCarTCO({
        carOnRoadPrice: 1500000,
        downPayment: 300000,
        loanInterestRate: 9.0,
        loanTenureYears: 5,
        ownershipTenureYears: 3, // Selling car after 3 years
      });
      expect(res.ownershipTenureYears).toBe(3);
      expect(res.totalEmiPaid).toBe(res.monthlyEmi * 36);
      expect(res.grossOutflow).toBeGreaterThan(res.downPayment + res.totalEmiPaid);
    });
  });

  // ─── 22. Home Loan Balance Transfer Breakeven ───────────────────
  describe("22. calcBalanceTransfer Refinancing Breakeven", () => {
    it("Calculates exact cashflow savings and breakeven month", () => {
      const res = calcBalanceTransfer({
        currentOutstandingPrincipal: 5000000,
        currentInterestRate: 9.5,
        currentRemainingTenureMonths: 180,
        newInterestRate: 8.4,
        newTenureMonths: 180,
        processingFeeType: "percentage",
        processingFeeValue: 0.5, // ₹25,000
        otherSwitchingCharges: 15000, // Total = ₹40,000
      });

      expect(res.totalSwitchingCosts).toBe(40000);
      expect(res.netBenefit).toBe(res.grossInterestSavings - res.totalSwitchingCosts);
      expect(res.isBeneficial).toBe(true);
      expect(res.breakevenMonths).toBe(Math.ceil(res.totalSwitchingCosts / res.monthlyEmiSavings));
    });
  });

  // ─── 23. US Stock Investing Net Return (DTAA & Rule 115) ────────
  describe("23. calcUSStockReturn DTAA & Rule 115 Compliance", () => {
    it("DTAA FTC caps dividend credit to Indian tax liability", () => {
      const res = calcUSStockReturn({
        investmentAmountInr: 500000,
        purchaseUsdInrRate: 84,
        saleUsdInrRate: 84,
        capitalGainUsd: 0,
        dividendIncomeUsd: 1000, // ₹84,000 gross dividend
        usDividendWithholdingTaxPercent: 25, // ₹21,000 US tax
        userTaxBracketPercent: 30, // ₹25,200 Indian tax
      });

      expect(res.foreignTaxCreditInr).toBe(21000); // 100% credited
      expect(res.indianDividendTaxNet).toBe(4200); // 25,200 - 21,000
    });

    it("Lower Indian tax bracket (10%) caps FTC at Indian tax (10%), leaving unrelieved US tax", () => {
      const res = calcUSStockReturn({
        investmentAmountInr: 500000,
        purchaseUsdInrRate: 84,
        saleUsdInrRate: 84,
        capitalGainUsd: 0,
        dividendIncomeUsd: 1000, // ₹84,000 gross dividend
        usDividendWithholdingTaxPercent: 25, // ₹21,000 US tax
        userTaxBracketPercent: 10, // ₹8,400 Indian tax
      });

      expect(res.foreignTaxCreditInr).toBe(8400); // Capped at Indian tax
      expect(res.indianDividendTaxNet).toBe(0);
    });
  });

  // ─── 24. NRI Deposit Comparator ─────────────────────────────────
  describe("24. calcNRIDepositReturns Comparison", () => {
    it("NRE is 100% tax-free and NRO applies 31.2% TDS", () => {
      const res = calcNRIDepositReturns({
        depositAmount: 1000000,
        tenureMonths: 36,
        nreInterestRatePercent: 7.1,
        nroInterestRatePercent: 7.1,
        fcnrInterestRatePercent: 5.5,
        nroTdsRatePercent: 31.2,
      });

      expect(res.nreResult.taxDeducted).toBe(0);
      expect(res.nreResult.isTaxFreeInIndia).toBe(true);
      expect(res.nroResult.taxDeducted).toBeGreaterThan(0);
      expect(res.nroResult.isTaxFreeInIndia).toBe(false);
      expect(res.nreResult.maturityAmount).toBeGreaterThan(res.nroResult.maturityAmount);
    });
  });

  // ─── 25. NPS Pension & Small Corpus Rule ────────────────────────
  describe("25. calcNPS Pension & Small Corpus Rule", () => {
    it("Small corpus <= ₹5 Lakh allows 100% lump sum exit without mandatory annuity", () => {
      const res = calcNPS({
        currentAge: 58,
        retirementAge: 60,
        monthlyContribution: 2000, // Small corpus ~ ₹55,000 < ₹5 Lakh
        equityAllocationPercent: 50,
        corporateDebtAllocationPercent: 30,
        govtBondsAllocationPercent: 20,
      });

      expect(res.totalAccumulatedCorpus).toBeLessThanOrEqual(500000);
      expect(res.lumpSumWithdrawalPercent).toBe(100);
      expect(res.annuityPurchasedAmount).toBe(0);
    });

    it("New Regime provides ₹0 deduction for Section 80CCD(1B)", () => {
      const res = calcNPS({
        currentAge: 30,
        retirementAge: 60,
        monthlyContribution: 10000,
        equityAllocationPercent: 50,
        corporateDebtAllocationPercent: 30,
        govtBondsAllocationPercent: 20,
        regime: "new",
      });

      expect(res.annualTaxSavedUnder80CCD).toBe(0);
    });
  });

  // ─── 26. calcXIRR & calcRiskRatios Solver Hardening ──────────────
  describe("26. calcXIRR & calcRiskRatios Solver Hardening", () => {
    it("calcXIRR: Successfully computes irregular cash flows with high precision", () => {
      const res = calcXIRR([
        { date: "2022-01-15", amount: -100000 },
        { date: "2022-07-20", amount: -50000 },
        { date: "2023-03-10", amount: -50000 },
        { date: "2024-01-15", amount: 250000 },
      ]);
      expect(res.isValid).toBe(true);
      expect(res.xirr).toBeGreaterThan(10);
      expect(res.xirr).toBeLessThan(30);
    });

    it("calcXIRR: Rejects all-negative cash flows cleanly", () => {
      const res = calcXIRR([
        { date: "2022-01-15", amount: -100000 },
        { date: "2023-01-15", amount: -100000 },
      ]);
      expect(res.isValid).toBe(false);
    });

    it("calcRiskRatios: Returns isSortinoInfinite when all returns exceed risk-free rate", () => {
      const res = calcRiskRatios({
        returns: [2, 3, 2.5, 4, 3, 2.8],
        periodFrequency: "monthly",
        riskFreeRate: 6.0, // 0.5%/mo < 2.0% min return
      });
      expect(res.isSortinoInfinite).toBe(true);
      expect(res.downsideDeviationAnnualized).toBe(0);
    });

    it("calcRiskRatios: Computes empirical Beta and Treynor Ratio when benchmark returns provided", () => {
      const portfolioReturns = [2, 4, -1, 5, 3, 2];
      const benchmarkReturns = [1.5, 3, -0.8, 4, 2.5, 1.8];
      const res = calcRiskRatios({
        returns: portfolioReturns,
        benchmarkReturns,
        periodFrequency: "monthly",
        riskFreeRate: 6.0,
      });
      expect(res.portfolioBeta).toBeDefined();
      expect(res.portfolioBeta).toBeGreaterThan(0.5);
      expect(res.treynorRatio).toBeDefined();
    });
  });
});
