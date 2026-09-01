import { describe, it, expect } from "vitest";
import {
  calcTax,
  calcCapitalGains,
  calcFnOBreakeven,
  calcBalanceTransfer,
  calcLRSTCS,
  calcNPS,
  calcNRIDepositReturns,
  calcRiskRatios,
  getCiiValue,
} from "../lib/math";

describe("FINCALC INDIA — STATUTORY AUDIT V3 COMPREHENSIVE SUITE", () => {
  // ─── 1. SECTION 156 REBATE & MARGINAL RELIEF ───────────────────
  describe("1. Section 156 Rebate & Section 156(2)(b) Marginal Relief", () => {
    it("1.1. Exact ₹12,00,000 taxable income gets 100% slab tax rebate (₹60,000) -> ₹0 Tax", () => {
      const res = calcTax({ grossIncome: 1275000, salaryIncome: 1275000, regime: "new" });
      expect(res.taxableIncome).toBe(1200000);
      expect(res.slabTaxBeforeRebate).toBe(60000);
      expect(res.rebateAmount).toBe(60000);
      expect(res.isMarginalRebateApplied).toBe(false);
      expect(res.totalTax).toBe(0);
      expect(res.cess).toBe(0);
    });

    it("1.2. Taxable income ₹12,00,100 applies Section 156(2)(b) marginal rebate (tax before cess = ₹100)", () => {
      const res = calcTax({ grossIncome: 1275100, salaryIncome: 1275100, regime: "new" });
      expect(res.taxableIncome).toBe(1200100);
      expect(res.isMarginalRebateApplied).toBe(true);
      // Slab tax without rebate would be 60,000 + 15% of 100 = 60,015
      // Tax capped at excess income = ₹100
      // Cess @ 4% on ₹100 = ₹4
      expect(res.totalTax).toBe(104);
      expect(res.rebateAmount).toBe(60015 - 100); // 59,915
    });

    it("1.3. Taxable income ₹12,50,000 applies Section 156(2)(b) marginal rebate (tax before cess = ₹50,000)", () => {
      const res = calcTax({ grossIncome: 1325000, salaryIncome: 1325000, regime: "new" });
      expect(res.taxableIncome).toBe(1250000);
      expect(res.isMarginalRebateApplied).toBe(true);
      // Slab tax without rebate = 60,000 + 15% of 50,000 = 67,500
      // Tax before cess capped at ₹50,000
      // Cess @ 4% on 50,000 = ₹2,000
      expect(res.totalTax).toBe(52000);
      expect(res.rebateAmount).toBe(17500); // 67,500 - 50,000
    });

    it("1.4. Taxable income ₹12,70,588 is the exact breakeven boundary of Section 156(2)(b)", () => {
      const res = calcTax({ grossIncome: 1270588 + 75000, salaryIncome: 1270588 + 75000, regime: "new" });
      expect(res.taxableIncome).toBe(1270588);
      // Slab tax = 60,000 + 15% of 70,588 = 70,588.2
      // Excess = 70,588. Base tax <= excess, so rebate reaches ₹0
      expect(res.totalTax).toBe(Math.round(70588 * 1.04));
    });

    it("1.5. Taxable income > ₹12,70,588 (e.g. ₹13,00,000) receives ₹0 rebate", () => {
      const res = calcTax({ grossIncome: 1375000, salaryIncome: 1375000, regime: "new" });
      expect(res.taxableIncome).toBe(1300000);
      expect(res.rebateAmount).toBe(0);
      expect(res.isMarginalRebateApplied).toBe(false);
      // Slab tax = 60,000 + 15% of 1,00,000 = 75,000 + 4% cess = 78,000
      expect(res.totalTax).toBe(78000);
    });

    it("1.6. Non-Resident Individual (NRI) receives ₹0 Section 156 rebate regardless of income", () => {
      const res = calcTax({
        grossIncome: 800000,
        salaryIncome: 800000,
        regime: "new",
        residency: "nri",
      });
      expect(res.taxableIncome).toBe(725000);
      expect(res.rebateAmount).toBe(0);
      // Slab tax on 7.25L: 4L @ 0, 3.25L @ 5% = 16,250 + 4% cess = 16,900
      expect(res.totalTax).toBe(16900);
    });

    it("1.7. Standard deduction (₹75k New / ₹50k Old) is capped strictly to salary income", () => {
      // Scenario A: Non-salary business/other income only (salary = 0)
      const resNonSalary = calcTax({
        grossIncome: 0,
        salaryIncome: 0,
        interestAndOtherIncome: 1000000,
        regime: "new",
      });
      expect(resNonSalary.standardDeduction).toBe(0);
      expect(resNonSalary.taxableIncome).toBe(1000000);

      // Scenario B: Salary ₹40,000 (less than ₹75,000 standard deduction cap)
      const resSmallSalary = calcTax({
        grossIncome: 40000,
        salaryIncome: 40000,
        regime: "new",
      });
      expect(resSmallSalary.standardDeduction).toBe(40000);
      expect(resSmallSalary.taxableIncome).toBe(0);
    });
  });

  // ─── 2. OLD REGIME AGE CATEGORIES ──────────────────────────────
  describe("2. Old Regime Age Categories & Basic Exemption Limits", () => {
    it("2.1. Below 60 years has ₹2,50,000 basic exemption limit", () => {
      const res = calcTax({
        grossIncome: 500000,
        salaryIncome: 500000,
        regime: "old",
        ageCategory: "below_60",
      });
      // 5L - 50k std ded = 4.5L taxable.
      // 0-2.5L nil, 2.5-4.5L (2L @ 5%) = 10,000.
      // Section 87A old regime rebate (taxable <= 5L) wipes out ₹10,000.
      expect(res.taxableIncome).toBe(450000);
      expect(res.slabTaxBeforeRebate).toBe(10000);
      expect(res.rebateAmount).toBe(10000);
      expect(res.totalTax).toBe(0);
    });

    it("2.2. Senior Citizen (60-79 years) has ₹3,00,000 basic exemption limit", () => {
      const res = calcTax({
        grossIncome: 700000,
        salaryIncome: 700000,
        regime: "old",
        ageCategory: "senior_60_to_79",
      });
      // 7L - 50k std ded = 6.5L taxable.
      // 0-3L nil, 3-5L (2L @ 5% = 10k), 5-6.5L (1.5L @ 20% = 30k) = 40,000.
      expect(res.taxableIncome).toBe(650000);
      expect(res.slabTaxBeforeRebate).toBe(40000);
      expect(res.totalTax).toBe(Math.round(40000 * 1.04));
    });

    it("2.3. Super Senior Citizen (80+ years) has ₹5,00,000 basic exemption limit", () => {
      const res = calcTax({
        grossIncome: 700000,
        salaryIncome: 700000,
        regime: "old",
        ageCategory: "super_senior_80_plus",
      });
      // 7L - 50k std ded = 6.5L taxable.
      // 0-5L nil, 5-6.5L (1.5L @ 20% = 30k) = 30,000.
      expect(res.taxableIncome).toBe(650000);
      expect(res.slabTaxBeforeRebate).toBe(30000);
      expect(res.totalTax).toBe(Math.round(30000 * 1.04));
    });
  });

  // ─── 3. REAL ESTATE CAPITAL GAINS GRANDFATHERING ────────────────
  describe("3. Real Estate Capital Gains Grandfathering & CII", () => {
    it("3.1. CII values for FY 2024-25, 2025-26, and 2026-27 are correctly configured", () => {
      expect(getCiiValue("2024-25")).toBe(363);
      expect(getCiiValue("2025-26")).toBe(376);
      expect(getCiiValue("2026-27")).toBe(384);
    });

    it("3.2. Resident Individual selling pre-23 July 2024 property gets lower tax via dual comparison", () => {
      const res = calcCapitalGains({
        assetClass: "real_estate",
        purchasePrice: 2000000,
        salePrice: 5000000,
        holdingMonths: 60, // 5 years (>24m = LTCG)
        isPurchasedBeforeCutoff: true,
        purchaseCiiYear: 2018, // 2018-19 CII = 280
        saleCiiYear: 2026,     // 2026-27 CII = 384
        taxpayerCategory: "resident_individual",
      });

      expect(res.realEstateComparison?.isGrandfatheringEligible).toBe(true);
      expect(res.totalTaxPayable).toBeLessThanOrEqual(res.realEstateComparison?.unindexedTax ?? Infinity);
    });

    it("3.3. Non-Resident (NRI) selling pre-23 July 2024 property is NOT eligible for indexation grandfathering (flat 12.5%)", () => {
      const res = calcCapitalGains({
        assetClass: "real_estate",
        purchasePrice: 2000000,
        salePrice: 5000000,
        holdingMonths: 60,
        isPurchasedBeforeCutoff: true,
        purchaseCiiYear: 2018,
        saleCiiYear: 2026,
        taxpayerCategory: "nri",
      });

      expect(res.realEstateComparison).toBeUndefined();
      expect(res.taxRatePercent).toBe(12.5);
    });
  });

  // ─── 4. F&O BROKERAGE & VERSIONED STT MATRIX ────────────────────
  describe("4. F&O Brokerage & Versioned STT Cost Matrix", () => {
    it("4.1. Period C (From 1 Apr 2026) applies 0.05% Futures STT and 0.15% Options Premium STT", () => {
      const res = calcFnOBreakeven({
        instrument: "futures",
        buyPrice: 25000,
        sellPrice: 25100,
        quantity: 50,
        taxYear: "period_c_from_apr_2026",
      });

      // Sell turnover = 25100 * 50 = 12,55,000
      // Futures STT @ 0.05% on sell = 627.5
      expect(res.sttRatePercentUsed).toBe(0.05);
      expect(res.charges.stt).toBe(627.5);
    });

    it("4.2. Period B (Oct 2024 to Mar 2026) applies 0.02% Futures STT and 0.10% Options Premium STT", () => {
      const res = calcFnOBreakeven({
        instrument: "futures",
        buyPrice: 25000,
        sellPrice: 25100,
        quantity: 50,
        taxYear: "period_b_oct_2024_to_mar_2026",
      });

      // Sell turnover = 12,55,000. STT @ 0.02% = 251
      expect(res.sttRatePercentUsed).toBe(0.02);
      expect(res.charges.stt).toBe(251);
    });

    it("4.3. Period A (Pre-Oct 2024) applies 0.0125% Futures STT and 0.0625% Options Premium STT", () => {
      const res = calcFnOBreakeven({
        instrument: "options",
        buyPrice: 100,
        sellPrice: 120,
        quantity: 50,
        taxYear: "period_a_pre_oct_2024",
      });

      // Sell premium turnover = 120 * 50 = 6,000. STT @ 0.0625% = 3.75
      expect(res.sttRatePercentUsed).toBe(0.0625);
      expect(res.charges.stt).toBe(3.75);
    });
  });

  // ─── 5. HOME LOAN BALANCE TRANSFER SIMULATION ───────────────────
  describe("5. Home Loan Balance Transfer & Refinance Simulation", () => {
    it("5.1. Lowers interest rate and produces positive net savings with timeline", () => {
      const res = calcBalanceTransfer({
        currentOutstandingPrincipal: 5000000, // ₹50 Lakhs
        currentInterestRate: 9.25,
        currentRemainingTenureMonths: 240, // 20 years
        newInterestRate: 8.50,
        newTenureMonths: 240,
        processingFeeValue: 10000,
        processingFeeType: "flat",
        otherSwitchingCharges: 15000,
      });

      expect(res.isBeneficial).toBe(true);
      expect(res.monthlyEmiSavings).toBeGreaterThan(2000);
      expect(res.netBenefit).toBeGreaterThan(400000);
      expect(res.breakevenMonths).toBeLessThan(15);
      expect(res.timeline.length).toBeGreaterThan(0);
      expect(res.isTenureExtendedAndHarmful).toBe(false);
    });

    it("5.2. Flags harmful tenure extension when refinancing increases total lifetime interest", () => {
      const res = calcBalanceTransfer({
        currentOutstandingPrincipal: 5000000,
        currentInterestRate: 8.75,
        currentRemainingTenureMonths: 120, // 10 years left
        newInterestRate: 8.50,      // slight rate drop
        newTenureMonths: 300,       // extended to 25 years!
        processingFeeValue: 10000,
        processingFeeType: "flat",
        otherSwitchingCharges: 15000,
      });

      expect(res.isTenureExtendedAndHarmful).toBe(true);
      expect(res.netBenefit).toBeLessThan(0);
    });
  });

  // ─── 6. LRS TCS UNDER FINANCE ACT 2026 / SECTION 394 ───────────
  describe("6. LRS TCS Under Finance Act, 2026 / Section 394", () => {
    it("6.1. Overseas tour package applies flat 2% on entire amount without ₹10L split", () => {
      const res = calcLRSTCS({
        category: "overseas_tour_package",
        remittanceAmountInr: 1500000,
      });
      expect(res.tier1RatePercent).toBe(2.0);
      expect(res.totalTcsDeducted).toBe(30000); // 2% of 15L
      expect(res.totalOutflowInr).toBe(1530000);
    });

    it("6.2. Education self-funded applies 0% up to ₹10L and 2% above ₹10L", () => {
      const res = calcLRSTCS({
        category: "education_self",
        remittanceAmountInr: 1500000,
      });
      // 10L @ 0% + 5L @ 2% = 10,000
      expect(res.totalTcsDeducted).toBe(10000);
    });

    it("6.3. Education loan u/s 80E is 100% exempt across all remittance amounts", () => {
      const res = calcLRSTCS({
        category: "education_loan",
        remittanceAmountInr: 5000000,
      });
      expect(res.totalTcsDeducted).toBe(0);
    });

    it("6.4. General investments apply 0% up to ₹10L and 20% above ₹10L", () => {
      const res = calcLRSTCS({
        category: "general_investment",
        remittanceAmountInr: 1500000,
      });
      // 10L @ 0% + 5L @ 20% = 1,00,000
      expect(res.totalTcsDeducted).toBe(100000);
      expect(res.totalOutflowInr).toBe(1600000);
    });
  });

  // ─── 7. NPS MODELER PFRDA 2026 ALL CITIZEN RULES ────────────────
  describe("7. NPS Modeler PFRDA 2026 All Citizen Rules", () => {
    it("7.1. Allows up to 80% lump sum exit, with 60% tax-free u/s 10(12A) and excess 20% taxable", () => {
      const res = calcNPS({
        currentAge: 30,
        retirementAge: 60,
        monthlyContribution: 10000,
        equityAllocationPercent: 50,
        corporateDebtAllocationPercent: 30,
        govtBondsAllocationPercent: 20,
        lumpSumWithdrawalPercent: 80, // Maximum allowed by PFRDA 2026
        assumedAnnuityYieldPercent: 6.5,
      });

      expect(res.isValid).toBe(true);
      expect(Math.abs(res.permittedLumpSumAmount - res.totalAccumulatedCorpus * 0.80)).toBeLessThanOrEqual(1);
      expect(Math.abs(res.lumpSumTaxFreeAmount - res.totalAccumulatedCorpus * 0.60)).toBeLessThanOrEqual(1);
      expect(Math.abs(res.taxableLumpSumAmount - res.totalAccumulatedCorpus * 0.20)).toBeLessThanOrEqual(1);
      expect(Math.abs(res.annuityPurchasedAmount - res.totalAccumulatedCorpus * 0.20)).toBeLessThanOrEqual(1);
    });

    it("7.2. Superannuation small corpus <= ₹8 Lakhs allows 100% lump sum withdrawal", () => {
      const res = calcNPS({
        currentAge: 58,
        retirementAge: 60,
        monthlyContribution: 1000, // Small corpus ~ ₹28,000 < ₹8 Lakhs
        equityAllocationPercent: 50,
        corporateDebtAllocationPercent: 30,
        govtBondsAllocationPercent: 20,
      });

      expect(res.totalAccumulatedCorpus).toBeLessThanOrEqual(800000);
      expect(res.lumpSumWithdrawalPercent).toBe(100);
      expect(res.annuityPurchasedAmount).toBe(0);
    });
  });

  // ─── 8. PORTFOLIO RISK RATIOS & BETA ────────────────────────────
  describe("8. Portfolio Risk Ratios & Empirical Beta", () => {
    it("8.1. Calculates empirical beta and Treynor ratio when benchmark returns are supplied", () => {
      const portfolioReturns = [2, 4, -1, 5, 3, -2, 4, 6, 1, 3, 2, 4];
      const benchmarkReturns = [1.5, 3, -0.5, 4, 2.5, -1.5, 3, 4.5, 1, 2.5, 1.8, 3.2];

      const res = calcRiskRatios({
        returns: portfolioReturns,
        benchmarkReturns,
        periodFrequency: "monthly",
        riskFreeRate: 6.0,
      });

      expect(res.portfolioBeta).toBeDefined();
      expect(res.portfolioBeta!).toBeGreaterThan(0.5);
      expect(res.treynorRatio).toBeDefined();
      expect(res.treynorRatio!).toBeGreaterThan(0);
    });

    it("8.2. Flags isSortinoInfinite = true when all periods outperform risk-free rate", () => {
      const returns = [3, 4, 5, 3, 4, 5]; // all > 0.5% monthly Rf
      const res = calcRiskRatios({
        returns,
        periodFrequency: "monthly",
        riskFreeRate: 6.0,
      });

      expect(res.isSortinoInfinite).toBe(true);
      expect(res.sortinoRatio).toBeUndefined();
    });
  });

  // ─── 9. NRI DEPOSIT COMPARATOR & DTAA FTC ─────────────────────────
  describe("9. NRI Deposit Comparator & DTAA FTC", () => {
    it("9.1. Compares NRE (tax-free), NRO (31.2% TDS), and FCNR with DTAA foreign tax credit", () => {
      const res = calcNRIDepositReturns({
        depositAmount: 1000000,
        tenureMonths: 12,
        nreInterestRatePercent: 7.25,
        nroInterestRatePercent: 7.25,
        fcnrInterestRatePercent: 5.5,
        startingUsdInrRate: 84.0,
        expectedMaturityUsdInrRate: 87.0,
        homeCountryTaxRatePercent: 20.0,
      });

      expect(res.nreResult.isTaxFreeInIndia).toBe(true);
      expect(res.nreResult.taxDeducted).toBe(0);
      expect(res.nroResult.isTaxFreeInIndia).toBe(false);
      expect(res.nroResult.taxDeducted).toBeGreaterThan(0);
      expect(res.sideBySideComparison.length).toBe(3);
    });
  });
});
