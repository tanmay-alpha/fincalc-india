import { describe, it, expect } from "vitest";
import { calcNPS, NPS_CONSTANTS } from "../lib/math";

describe("NPS 80CCD(2) Salary Caps & PFRDA Exit Options", () => {
  describe("Section 80CCD(2) Statutory Caps", () => {
    it("enforces 14% ceiling for private corporate employees under New Regime", () => {
      // Annual Basic Salary: ₹20,00,000. 14% cap = ₹2,80,000.
      // Employer contributes ₹30,000/mo = ₹3,60,000/yr.
      const res = calcNPS({
        currentAge: 30,
        retirementAge: 60,
        monthlyContribution: 10000,
        equityAllocationPercent: 50,
        corporateDebtAllocationPercent: 30,
        govtBondsAllocationPercent: 20,
        regime: "new",
        isGovtEmployee: false,
        eligibleSalaryFor80CCD2: 2000000,
        employerMonthlyContribution: 30000,
        taxBracketPercent: 30,
      });

      expect(res.salaryCap80CCD2Percent).toBe(14);
      expect(res.actualEmployerContribution).toBe(360000);
      expect(res.eligibleDeduction80CCD2).toBe(280000); // 14% of 20L
      expect(res.excessEmployerContributionNotDeductible).toBe(80000); // 3.6L - 2.8L
      expect(res.taxSaving80CCD2).toBe(84000); // 2.8L * 30%
    });

    it("enforces 10% ceiling for private corporate employees under Old Regime", () => {
      // Annual Basic Salary: ₹20,00,000. 10% cap = ₹2,00,000.
      // Employer contributes ₹25,000/mo = ₹3,00,000/yr.
      const res = calcNPS({
        currentAge: 30,
        retirementAge: 60,
        monthlyContribution: 10000,
        equityAllocationPercent: 50,
        corporateDebtAllocationPercent: 30,
        govtBondsAllocationPercent: 20,
        regime: "old",
        isGovtEmployee: false,
        eligibleSalaryFor80CCD2: 2000000,
        employerMonthlyContribution: 25000,
        taxBracketPercent: 30,
      });

      expect(res.salaryCap80CCD2Percent).toBe(10);
      expect(res.actualEmployerContribution).toBe(300000);
      expect(res.eligibleDeduction80CCD2).toBe(200000); // 10% of 20L
      expect(res.excessEmployerContributionNotDeductible).toBe(100000);
      expect(res.taxSaving80CCD2).toBe(60000); // 2L * 30%
    });

    it("enforces 14% ceiling for Government employees under Old Regime", () => {
      // Annual Basic Salary: ₹20,00,000. Govt gets 14% cap = ₹2,80,000.
      const res = calcNPS({
        currentAge: 30,
        retirementAge: 60,
        monthlyContribution: 10000,
        equityAllocationPercent: 50,
        corporateDebtAllocationPercent: 30,
        govtBondsAllocationPercent: 20,
        regime: "old",
        isGovtEmployee: true,
        eligibleSalaryFor80CCD2: 2000000,
        employerMonthlyContribution: 25000,
        taxBracketPercent: 30,
      });

      expect(res.salaryCap80CCD2Percent).toBe(14);
      expect(res.actualEmployerContribution).toBe(300000);
      expect(res.eligibleDeduction80CCD2).toBe(280000);
      expect(res.excessEmployerContributionNotDeductible).toBe(20000);
    });

    it("allows full deduction when employer contribution is below statutory cap", () => {
      // Annual Basic Salary: ₹20,00,000. Cap = ₹2,80,000.
      // Employer contributes ₹15,000/mo = ₹1,80,000/yr.
      const res = calcNPS({
        currentAge: 30,
        retirementAge: 60,
        monthlyContribution: 10000,
        equityAllocationPercent: 50,
        corporateDebtAllocationPercent: 30,
        govtBondsAllocationPercent: 20,
        regime: "new",
        eligibleSalaryFor80CCD2: 2000000,
        employerMonthlyContribution: 15000,
      });

      expect(res.eligibleDeduction80CCD2).toBe(180000);
      expect(res.excessEmployerContributionNotDeductible).toBe(0);
    });
  });

  describe("PFRDA Exit Options & Section 10(12A) Exemption", () => {
    it("allows 100% lump sum payout for small corpus (<= ₹8 Lakh) at retirement", () => {
      // Small monthly contribution for 3 years
      const res = calcNPS({
        currentAge: 57,
        retirementAge: 60,
        monthlyContribution: 5000,
        equityAllocationPercent: 50,
        corporateDebtAllocationPercent: 30,
        govtBondsAllocationPercent: 20,
        isPrematureExit: false,
      });

      expect(res.totalAccumulatedCorpus).toBeLessThanOrEqual(NPS_CONSTANTS.smallCorpusFullWithdrawalLimit);
      expect(res.regulatoryExitCategory).toBe("small_corpus_full_payout");
      expect(res.lumpSumWithdrawalPercent).toBe(100);
      // Section 10(12A) exempts only 60% of total corpus
      expect(res.lumpSumTaxFreeAmount).toBe(Math.round(res.totalAccumulatedCorpus * 0.60));
      expect(res.taxableLumpSumAmount).toBe(Math.round(res.totalAccumulatedCorpus * 0.40));
    });

    it("models ₹8L to ₹12L corpus special exit options", () => {
      // Setting contribution to produce a corpus in ₹8L–₹12L bracket
      const res = calcNPS({
        currentAge: 55,
        retirementAge: 60,
        monthlyContribution: 12000,
        equityAllocationPercent: 50,
        corporateDebtAllocationPercent: 30,
        govtBondsAllocationPercent: 20,
        isPrematureExit: false,
        exitOptionChoice: "sur_6yr_split",
      });

      if (res.totalAccumulatedCorpus > 800000 && res.totalAccumulatedCorpus <= 1200000) {
        expect(res.regulatoryExitCategory).toBe("corpus_8L_to_12L_special");
        expect(res.exitOptionsAvailable.length).toBe(2);
        expect(res.exitOptionsAvailable.some((opt) => opt.id === "sur_6yr_split")).toBe(true);
      }
    });

    it("enforces premature exit limits (max 20% lump sum, min 80% annuity when > ₹5L)", () => {
      const res = calcNPS({
        currentAge: 30,
        retirementAge: 45,
        monthlyContribution: 15000,
        equityAllocationPercent: 50,
        corporateDebtAllocationPercent: 30,
        govtBondsAllocationPercent: 20,
        isPrematureExit: true,
      });

      expect(res.totalAccumulatedCorpus).toBeGreaterThan(500000);
      expect(res.regulatoryExitCategory).toBe("premature_exit");
      expect(res.lumpSumWithdrawalPercent).toBeLessThanOrEqual(20);
      expect(res.annuityReinvestmentPercent).toBeGreaterThanOrEqual(80);
    });
  });
});
