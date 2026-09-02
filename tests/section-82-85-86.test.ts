import { describe, it, expect } from "vitest";
import { calcSection54Exemption } from "@/lib/math";

describe("Section 82, 85, and 86 Statutory Compliance", () => {
  describe("Section 82 Two-House Option & Independent Property Validation", () => {
    it("rejects two-house option if history is unconfirmed", () => {
      const res = calcSection54Exemption({
        sectionType: "section_54_property",
        capitalGainsAmount: 15000000, // 1.5 Cr
        propertyInvestmentAmount: 8000000, // 80L
        propertyMode: "purchase",
        propertyTimelineMonths: 6,
        useTwoResidentialHousesOption: true,
        twoHousesOptionHistory: "unconfirmed",
        secondPropertyInvestmentAmount: 7000000, // 70L
      });

      expect(res.activeResult.twoHousesOptionApplied).toBe(false);
      expect(res.activeResult.twoHousesOptionMessage).toContain("requires confirmation of prior utilization history");
      expect(res.activeResult.investmentAmount).toBe(8000000); // only House 1 counted
    });

    it("rejects two-house option if history is used_before", () => {
      const res = calcSection54Exemption({
        sectionType: "section_54_property",
        capitalGainsAmount: 15000000,
        propertyInvestmentAmount: 8000000,
        propertyMode: "purchase",
        propertyTimelineMonths: 6,
        useTwoResidentialHousesOption: true,
        twoHousesOptionHistory: "used_before",
        secondPropertyInvestmentAmount: 7000000,
      });

      expect(res.activeResult.twoHousesOptionApplied).toBe(false);
      expect(res.activeResult.twoHousesOptionMessage).toContain("once-in-a-lifetime");
      expect(res.activeResult.investmentAmount).toBe(8000000);
    });

    it("applies two-house option when never_used and LTCG <= 2 Crore", () => {
      const res = calcSection54Exemption({
        sectionType: "section_54_property",
        capitalGainsAmount: 18000000, // 1.8 Cr
        propertyInvestmentAmount: 10000000, // 1 Cr
        propertyMode: "purchase",
        propertyTimelineMonths: 6,
        useTwoResidentialHousesOption: true,
        twoHousesOptionHistory: "never_used",
        secondPropertyInvestmentAmount: 8000000, // 80L
        secondPropertyMode: "purchase",
        secondPropertyTimelineMonths: 12,
      });

      expect(res.activeResult.twoHousesOptionApplied).toBe(true);
      expect(res.activeResult.investmentAmount).toBe(18000000);
      expect(res.activeResult.exemptionAllowed).toBe(18000000);
      expect(res.activeResult.taxableGainsRemaining).toBe(0);
    });

    it("validates House #1 and House #2 independently (House #2 invalid timeline excluded)", () => {
      const res = calcSection54Exemption({
        sectionType: "section_54_property",
        capitalGainsAmount: 18000000,
        propertyInvestmentAmount: 10000000,
        propertyMode: "purchase",
        propertyTimelineMonths: 6, // Valid
        useTwoResidentialHousesOption: true,
        twoHousesOptionHistory: "never_used",
        secondPropertyInvestmentAmount: 8000000,
        secondPropertyMode: "purchase",
        secondPropertyTimelineMonths: 36, // INVALID (> 24m for purchase)
      });

      expect(res.activeResult.twoHousesOptionApplied).toBe(true);
      // Only House 1 qualifying amount counts:
      expect(res.activeResult.investmentAmount).toBe(10000000);
      expect(res.activeResult.exemptionAllowed).toBe(10000000);
      expect(res.activeResult.taxableGainsRemaining).toBe(8000000);
    });
  });

  describe("Section 85 (₹50 Lakh Statutory Aggregate Window)", () => {
    it("Case 1: 0 prior + 50 current = 50 eligible", () => {
      const res = calcSection54Exemption({
        sectionType: "section_54ec_bonds",
        capitalGainsAmount: 8000000,
        bondsInvestmentAmount: 5000000,
        bondsTimelineMonths: 3,
        priorInvestmentInRelevantSection85Window: 0,
      });
      expect(res.activeResult.exemptionAllowed).toBe(5000000);
    });

    it("Case 2: 30 prior + 40 current = 20 eligible now", () => {
      const res = calcSection54Exemption({
        sectionType: "section_54ec_bonds",
        capitalGainsAmount: 8000000,
        bondsInvestmentAmount: 4000000,
        bondsTimelineMonths: 3,
        priorInvestmentInRelevantSection85Window: 3000000,
      });
      expect(res.activeResult.exemptionAllowed).toBe(2000000);
    });

    it("Case 3: 49 prior + 5 current = 1 eligible now", () => {
      const res = calcSection54Exemption({
        sectionType: "section_54ec_bonds",
        capitalGainsAmount: 8000000,
        bondsInvestmentAmount: 500000,
        bondsTimelineMonths: 3,
        priorInvestmentInRelevantSection85Window: 4900000,
      });
      expect(res.activeResult.exemptionAllowed).toBe(100000);
    });

    it("Case 4: 50 prior + 10 current = 0 eligible now", () => {
      const res = calcSection54Exemption({
        sectionType: "section_54ec_bonds",
        capitalGainsAmount: 8000000,
        bondsInvestmentAmount: 1000000,
        bondsTimelineMonths: 3,
        priorInvestmentInRelevantSection85Window: 5000000,
      });
      expect(res.activeResult.exemptionAllowed).toBe(0);
    });
  });

  describe("Section 86 Disentangled Conditions", () => {
    it("Section 82 conditions do NOT include general house purchase restrictions", () => {
      const res = calcSection54Exemption({
        sectionType: "section_54_property",
        capitalGainsAmount: 5000000,
        propertyInvestmentAmount: 5000000,
      });

      const conds = res.activeResult.conditions.join(" ");
      expect(conds).toContain("Section 263");
      expect(conds).toContain("Section 82 contains no restriction against purchasing other residential houses");
    });

    it("Section 86 conditions clearly state additional-house restrictions", () => {
      const res = calcSection54Exemption({
        sectionType: "section_54f_property",
        capitalGainsAmount: 5000000,
        propertyInvestmentAmount: 5000000,
        netSaleConsideration: 5000000,
      });

      const conds = res.activeResult.conditions.join(" ");
      expect(conds).toContain("Section 86 Disqualification / Recapture");
      expect(conds).toContain("1 year before or 2 years after transfer date");
    });
  });
});
