import { describe, expect, it } from "vitest";
import { calcTax } from "@/lib/math";

/**
 * Sources:
 * - Income-tax Department: Tax Year 2026-27 is governed by Income-tax Act, 2025.
 *   https://www.incometax.gov.in/iec/foportal/help/all-topics/e-filing-services/General%20Questions-faqs?mobile-app=1
 * - Finance (No. 2) Bill 2024, amendment to legacy section 112A: the ₹1.25L
 *   threshold applies to the amount on which special-rate tax is calculated.
 *   https://www.indiabudget.gov.in/budget2024-25/doc/Finance_Bill.pdf
 */
describe("Section 112A LTCG total-income treatment", () => {
  it("includes threshold-exempt equity LTCG in total income while charging special tax only above ₹1.25L", () => {
    const result = calcTax({
      interestAndOtherIncome: 1_075_000,
      equityLtcg: 125_000,
      regime: "new",
      residency: "resident_individual",
    });

    expect(result.equityLtcgIncludedInTotalIncome).toBe(125_000);
    expect(result.equityLtcgChargeableAtSpecialRate).toBe(0);
    expect(result.totalTaxableIncome).toBe(1_200_000);
    expect(result.totalTax).toBe(0);
  });

  it("does not grant the full Section 156 rebate when exempt-threshold LTCG pushes total income above ₹12L", () => {
    const result = calcTax({
      interestAndOtherIncome: 1_100_000,
      equityLtcg: 125_000,
      regime: "new",
      residency: "resident_individual",
    });

    expect(result.totalTaxableIncome).toBe(1_225_000);
    expect(result.rebateAmount).toBe(25_000);
    expect(result.taxBeforeCess).toBe(25_000);
    expect(result.totalTax).toBe(26_000);
  });
});
