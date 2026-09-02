import { describe, it, expect } from "vitest";
import { calcNPS } from "@/lib/math";

describe("NPS 80CCD(2) Salary Validation & Missing Salary Semantics", () => {
  it("returns deductionStatus80CCD2: salary_required and zero deduction when employer contribution is provided without salary", () => {
    const res = calcNPS({
      currentAge: 30,
      retirementAge: 60,
      monthlyContribution: 10000,
      employerMonthlyContribution: 8000,
      // No salary provided!
      equityAllocationPercent: 50,
      corporateDebtAllocationPercent: 30,
      govtBondsAllocationPercent: 20,
      regime: "new",
    });

    expect(res.deductionStatus80CCD2).toBe("salary_required");
    expect(res.eligibleDeduction80CCD2).toBe(0);
    expect(res.taxSaving80CCD2).toBe(0);
    expect(res.annualTaxSavedUnder80CCD2).toBe(0);
    // Crucially: Corpus projection proceeds normally with both self + employer contribution!
    expect(res.totalAmountInvested).toBe((10000 + 8000) * 12 * 30);
    expect(res.totalAccumulatedCorpus).toBeGreaterThan(0);
  });

  it("calculates statutory deduction accurately when salary is explicitly provided", () => {
    const res = calcNPS({
      currentAge: 30,
      retirementAge: 60,
      monthlyContribution: 10000,
      employerMonthlyContribution: 10000, // 1.2L annual
      eligibleSalaryFor80CCD2: 1200000,    // 12L salary
      equityAllocationPercent: 50,
      corporateDebtAllocationPercent: 30,
      govtBondsAllocationPercent: 20,
      regime: "new",                      // 14% cap = 1.68L
      taxBracketPercent: 30,
    });

    expect(res.deductionStatus80CCD2).toBe("eligible");
    expect(res.eligibleDeduction80CCD2).toBe(120000); // 1.2L <= 1.68L cap
    expect(res.taxSaving80CCD2).toBe(36000); // 30% of 1.2L
  });

  it("marks deductionStatus80CCD2: not_applicable when employer contribution is zero", () => {
    const res = calcNPS({
      currentAge: 30,
      monthlyContribution: 5000,
      employerMonthlyContribution: 0,
      equityAllocationPercent: 50,
      corporateDebtAllocationPercent: 30,
      govtBondsAllocationPercent: 20,
    });

    expect(res.deductionStatus80CCD2).toBe("not_applicable");
    expect(res.eligibleDeduction80CCD2).toBe(0);
  });
});
