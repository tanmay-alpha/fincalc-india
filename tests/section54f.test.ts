import { describe, it, expect } from "vitest";
import { calcSection54Exemption } from "../lib/math";

describe("Section 54F Capital Gains Statutory Exemption Tests (AY 2026-27)", () => {
  it("computes 100% exemption when new residential house cost >= net sale consideration", () => {
    // Sold unlisted shares / plot for ₹1 Crore with ₹40 Lakh LTCG.
    // Invested ₹1 Crore in new residential house.
    const res = calcSection54Exemption({
      sectionType: "section_54f_property",
      capitalGainsAmount: 4000000,
      netSaleConsideration: 10000000,
      propertyInvestmentAmount: 10000000,
      propertyMode: "purchase",
      propertyTimelineMonths: 12,
      existingResidentialHousesCount: 0,
    });

    expect(res.activeResult.section).toBe("54F");
    expect(res.activeResult.exemptionAllowed).toBe(4000000);
    expect(res.activeResult.taxableGainsRemaining).toBe(0);
    expect(res.activeResult.taxAfterExemption).toBe(0);
    expect(res.activeResult.taxSaved).toBe(res.taxBeforeExemption);
    expect(res.activeResult.disqualified).toBe(false);
  });

  it("applies proportionate exemption formula when investment < net consideration", () => {
    // Sold gold/plot: Net consideration = ₹1 Crore, LTCG = ₹40 Lakh.
    // Invested ₹50 Lakh in new residential house (50% of net consideration).
    // Exemption = ₹40L * (₹50L / ₹1Cr) = ₹20 Lakh.
    const res = calcSection54Exemption({
      sectionType: "section_54f_property",
      capitalGainsAmount: 4000000,
      netSaleConsideration: 10000000,
      propertyInvestmentAmount: 5000000,
      propertyMode: "purchase",
      propertyTimelineMonths: 6,
      existingResidentialHousesCount: 1, // 1 existing house is permitted
    });

    expect(res.activeResult.exemptionAllowed).toBe(2000000);
    expect(res.activeResult.taxableGainsRemaining).toBe(2000000);
    expect(res.activeResult.proportionateExemptionApplied).toBe(true);
    expect(res.activeResult.disqualified).toBe(false);
  });

  it("caps eligible new house cost at statutory ₹10 Crore cap", () => {
    // Sold commercial asset: Net consideration = ₹25 Crore, LTCG = ₹10 Crore.
    // Invested ₹15 Crore in new luxury residence.
    // Cap restricts recognized investment to ₹10 Crore.
    // Exemption = ₹10 Cr * (₹10 Cr / ₹25 Cr) = ₹4 Crore.
    const res = calcSection54Exemption({
      sectionType: "section_54f_property",
      capitalGainsAmount: 100000000,
      netSaleConsideration: 250000000,
      propertyInvestmentAmount: 150000000,
      propertyMode: "purchase",
      propertyTimelineMonths: 10,
      existingResidentialHousesCount: 0,
    });

    expect(res.activeResult.exemptionAllowed).toBe(40000000); // 4 Crore
    expect(res.activeResult.taxableGainsRemaining).toBe(60000000); // 6 Crore
  });

  it("strictly disqualifies taxpayer if owning more than 1 residential house on transfer date", () => {
    // Taxpayer owns 2 residential houses already on transfer date
    const res = calcSection54Exemption({
      sectionType: "section_54f_property",
      capitalGainsAmount: 5000000,
      netSaleConsideration: 10000000,
      propertyInvestmentAmount: 10000000,
      propertyMode: "purchase",
      propertyTimelineMonths: 6,
      existingResidentialHousesCount: 2,
    });

    expect(res.activeResult.disqualified).toBe(true);
    expect(res.activeResult.exemptionAllowed).toBe(0);
    expect(res.activeResult.taxableGainsRemaining).toBe(5000000);
    expect(res.activeResult.taxAfterExemption).toBe(res.taxBeforeExemption);
    expect(res.activeResult.disqualificationReason).toContain("owns more than one residential house");
  });

  it("validates statutory purchase (-12m to +24m) and construction (0m to +36m) windows", () => {
    // Invalid purchase: 30 months after sale
    const invalidPurchase = calcSection54Exemption({
      sectionType: "section_54f_property",
      capitalGainsAmount: 3000000,
      netSaleConsideration: 6000000,
      propertyInvestmentAmount: 6000000,
      propertyMode: "purchase",
      propertyTimelineMonths: 30,
    });
    expect(invalidPurchase.activeResult.isValidTimeline).toBe(false);
    expect(invalidPurchase.activeResult.exemptionAllowed).toBe(0);

    // Valid construction: 32 months after sale
    const validConstruction = calcSection54Exemption({
      sectionType: "section_54f_property",
      capitalGainsAmount: 3000000,
      netSaleConsideration: 6000000,
      propertyInvestmentAmount: 6000000,
      propertyMode: "construction",
      propertyTimelineMonths: 32,
    });
    expect(validConstruction.activeResult.isValidTimeline).toBe(true);
    expect(validConstruction.activeResult.exemptionAllowed).toBe(3000000);
  });
});
