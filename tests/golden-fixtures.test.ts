import { describe, it, expect } from "vitest";
import { calcTax, calcLRSTCS } from "../lib/math";
import salaryGolden from "./fixtures/statutory/salary-tax-golden.json";
import lrsGolden from "./fixtures/statutory/lrs-tcs-golden.json";

describe("Golden Statutory Fixtures Verification", () => {
  describe("Salary Tax AY 2026-27 Fixtures", () => {
    for (const fixture of salaryGolden) {
      it(fixture.description, () => {
        const result = calcTax(fixture.inputs as any);
        expect(result.standardDeduction).toBe(fixture.expected.standardDeduction);
        expect(result.totalTaxableIncome).toBe(fixture.expected.taxableIncome);
        expect(result.slabTaxBeforeRebate).toBe(fixture.expected.grossSlabTax);
        expect(result.rebateAmount).toBe(fixture.expected.rebateAmount);
        expect(result.taxBeforeCess).toBe(fixture.expected.netTaxBeforeCess);
        expect(result.cess).toBe(fixture.expected.cess);
        expect(result.totalTax).toBe(fixture.expected.totalTax);
      });
    }
  });

  describe("LRS TCS Finance Act 2026 Fixtures", () => {
    for (const fixture of lrsGolden) {
      it(fixture.description, () => {
        const result = calcLRSTCS(fixture.inputs as any);
        expect(result.tier1Tcs).toBe(fixture.expected.tier1Tcs);
        expect(result.tier2Tcs).toBe(fixture.expected.tier2Tcs);
        expect(result.totalTcsDeducted).toBe(fixture.expected.totalTcsDeducted);
        expect(result.totalOutflowInr).toBe(fixture.expected.totalOutflowInr);
      });
    }
  });
});
