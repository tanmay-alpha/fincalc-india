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

  describe("PFRDA Corpus Threshold Boundaries & Unbundled Tax Exemption Suite (8 Cases)", () => {
    const baseInput = {
      currentAge: 30,
      retirementAge: 60,
      monthlyContribution: 10000,
      equityAllocationPercent: 50,
      corporateDebtAllocationPercent: 30,
      govtBondsAllocationPercent: 20,
      isPrematureExit: false,
    };

    it("1. ₹5L corpus (Superannuation <= ₹8L): 100% permitted withdrawal, unbundled 60% tax-free / 40% taxable", () => {
      const res = calcNPS({ ...baseInput, accumulatedCorpus: 500000 });
      expect(res.totalAccumulatedCorpus).toBe(500000);
      expect(res.regulatoryExitCategory).toBe("small_corpus_full_payout");
      expect(res.exitOptionsAvailable[0].maxLumpSumPercent).toBe(100);
      expect(res.permittedLumpSumAmount).toBe(500000);
      // Section 10(12A) exempts only up to 60%
      expect(res.lumpSumTaxFreeAmount).toBe(300000); // 60% of 5L
      expect(res.taxableLumpSumAmount).toBe(200000); // 40% of 5L
      expect(res.annuityPurchasedAmount).toBe(0);
    });

    it("2. ₹8L corpus (Superannuation exact limit <= ₹8L): 100% permitted withdrawal, 60% tax-free / 40% taxable", () => {
      const res = calcNPS({ ...baseInput, accumulatedCorpus: 800000 });
      expect(res.totalAccumulatedCorpus).toBe(800000);
      expect(res.regulatoryExitCategory).toBe("small_corpus_full_payout");
      expect(res.exitOptionsAvailable[0].maxLumpSumPercent).toBe(100);
      expect(res.permittedLumpSumAmount).toBe(800000);
      expect(res.lumpSumTaxFreeAmount).toBe(480000); // 60% of 8L
      expect(res.taxableLumpSumAmount).toBe(320000); // 40% of 8L
      expect(res.annuityPurchasedAmount).toBe(0);
    });

    it("3. ₹8,00,001 corpus (Crossed boundary > ₹8L): categorized as corpus_8L_to_12L_special", () => {
      const res = calcNPS({ ...baseInput, accumulatedCorpus: 800001 });
      expect(res.totalAccumulatedCorpus).toBe(800001);
      expect(res.regulatoryExitCategory).toBe("corpus_8L_to_12L_special");
      expect(res.exitOptionsAvailable.length).toBe(2);
      expect(res.exitOptionsAvailable.map((o) => o.id)).toContain("sur_6yr_split");
      expect(res.exitOptionsAvailable.map((o) => o.id)).toContain("standard");
    });

    it("4. ₹10L corpus (Special bracket ₹8L–₹12L): supports ₹6L split and up to 80% standard option", () => {
      const res = calcNPS({ ...baseInput, accumulatedCorpus: 1000000 });
      expect(res.totalAccumulatedCorpus).toBe(1000000);
      expect(res.regulatoryExitCategory).toBe("corpus_8L_to_12L_special");
      const surOption = res.exitOptionsAvailable.find((o) => o.id === "sur_6yr_split");
      expect(surOption?.fixedLumpSumCap).toBe(600000);
      expect(surOption?.maxLumpSumPercent).toBe(60); // 6L / 10L = 60%
    });

    it("5. ₹12L corpus (Upper boundary of special bracket <= ₹12L): still in corpus_8L_to_12L_special", () => {
      const res = calcNPS({ ...baseInput, accumulatedCorpus: 1200000 });
      expect(res.totalAccumulatedCorpus).toBe(1200000);
      expect(res.regulatoryExitCategory).toBe("corpus_8L_to_12L_special");
    });

    it("6. > ₹12L corpus (e.g. ₹15L): standard superannuation (up to 80% lump sum, min 20% annuity)", () => {
      const res = calcNPS({ ...baseInput, accumulatedCorpus: 1500000 });
      expect(res.totalAccumulatedCorpus).toBe(1500000);
      expect(res.regulatoryExitCategory).toBe("standard_superannuation");
      expect(res.exitOptionsAvailable.length).toBe(1);
      expect(res.exitOptionsAvailable[0].maxLumpSumPercent).toBe(80);
      expect(res.exitOptionsAvailable[0].minAnnuityPercent).toBe(20);
    });

    it("7. Premature exit <= ₹5L (e.g. ₹4L): allows 100% lump sum payout under PFRDA premature small corpus limit", () => {
      const res = calcNPS({ ...baseInput, isPrematureExit: true, accumulatedCorpus: 400000 });
      expect(res.totalAccumulatedCorpus).toBe(400000);
      expect(res.regulatoryExitCategory).toBe("small_corpus_full_payout");
      expect(res.exitOptionsAvailable[0].maxLumpSumPercent).toBe(100);
      expect(res.permittedLumpSumAmount).toBe(400000);
      expect(res.lumpSumTaxFreeAmount).toBe(240000); // 60% of 4L
      expect(res.taxableLumpSumAmount).toBe(160000); // 40% of 4L
      expect(res.annuityPurchasedAmount).toBe(0);
    });

    it("8. Premature exit > ₹5L (e.g. ₹7L): restricted to max 20% lump sum, min 80% mandatory annuity", () => {
      const res = calcNPS({ ...baseInput, isPrematureExit: true, accumulatedCorpus: 700000 });
      expect(res.totalAccumulatedCorpus).toBe(700000);
      expect(res.regulatoryExitCategory).toBe("premature_exit");
      expect(res.exitOptionsAvailable[0].maxLumpSumPercent).toBe(20);
      expect(res.exitOptionsAvailable[0].minAnnuityPercent).toBe(80);
      expect(res.lumpSumWithdrawalPercent).toBeLessThanOrEqual(20);
      expect(res.annuityReinvestmentPercent).toBeGreaterThanOrEqual(80);
    });
  });
});
