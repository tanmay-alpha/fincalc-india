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

  describe("Section 54 / 54EC / 54F Statutory Original-Asset Eligibility & Ranking (Matrix A–I)", () => {
    it("Scenario A. Residential house: 54 eligible, 54EC eligible, 54F ineligible", () => {
      // LTCG = ₹80L from sale of residential house.
      // 54 invests 80L in house -> tax = 0.
      // 54EC capped at 50L -> 30L taxable -> tax = 3,90,000.
      // 54F: Even if 54F inputs provided, 54F is statutorily ineligible on residential house transfer.
      const res = calcSection54Exemption({
        sectionType: "compare_both",
        originalAssetType: "residential_house",
        capitalGainsAmount: 8000000,
        propertyInvestmentAmount: 8000000,
        propertyMode: "purchase",
        propertyTimelineMonths: 6,
        bondsInvestmentAmount: 5000000,
        bondsTimelineMonths: 3,
        netSaleConsideration: 16000000,
        existingResidentialHousesCount: 0,
      });

      expect(res.comparison).toBeDefined();
      expect(res.comparison?.section54.isStatutorilyEligible).toBe(true);
      expect(res.comparison?.section54ec.isStatutorilyEligible).toBe(true);
      expect(res.comparison?.section54f?.isStatutorilyEligible).toBe(false);
      expect(res.comparison?.section54f?.exemptionAllowed).toBe(0);

      // Ranking must only compare 54 vs 54EC
      expect(res.comparison?.bestStrategy).toBe("54");
      expect(res.comparison?.secondBestStrategy).toBe("54EC");
      expect(res.comparison?.worstStrategy).toBe("54EC");
      expect(res.comparison?.bestVsSecondBestTaxDifference).toBe(390000);
      expect(res.comparison?.taxDifference).toBe(390000);
      expect(res.comparison?.recommendation).toContain("saves ₹3,90,000 more than the next-best option (Section 85 (formerly Section 54EC Bonds");
      expect(res.comparison?.recommendation).toContain("Note (54F / Section 86): Ineligible: Section 86 (formerly Section 54F) is statutorily restricted to long-term capital assets other than a residential house");
    });

    it("Scenario B. Commercial property: 54 ineligible, 54EC eligible, 54F eligible", () => {
      // LTCG = ₹50L from commercial property sale, net sale = 1Cr.
      // 54: Ineligible (not residential house) -> exemption = 0.
      // 54EC: 50L bonds in 3m -> exemption = 50L -> tax = 0.
      // 54F: 50L invested in house, net sale 1Cr -> exemption = 25L -> tax = 3,25,000.
      const res = calcSection54Exemption({
        sectionType: "compare_both",
        originalAssetType: "land_or_building_non_residential",
        capitalGainsAmount: 5000000,
        netSaleConsideration: 10000000,
        section54InvestmentAmount: 5000000,
        section54PropertyMode: "purchase",
        section54TimelineMonths: 6,
        bondsInvestmentAmount: 5000000,
        bondsTimelineMonths: 3,
        section54fInvestmentAmount: 5000000,
        section54fPropertyMode: "purchase",
        section54fTimelineMonths: 6,
        existingResidentialHousesCount: 0,
      });

      expect(res.comparison).toBeDefined();
      expect(res.comparison?.section54.isStatutorilyEligible).toBe(false);
      expect(res.comparison?.section54.exemptionAllowed).toBe(0);
      expect(res.comparison?.section54ec.isStatutorilyEligible).toBe(true);
      expect(res.comparison?.section54f?.isStatutorilyEligible).toBe(true);

      // Ranking compares 54EC vs 54F only
      expect(res.comparison?.bestStrategy).toBe("54EC");
      expect(res.comparison?.secondBestStrategy).toBe("54F");
      expect(res.comparison?.worstStrategy).toBe("54F");
      expect(res.comparison?.bestVsSecondBestTaxDifference).toBe(325000);
      expect(res.comparison?.taxDifference).toBe(325000);
      expect(res.comparison?.recommendation).toContain("Note (54 / Section 82): Ineligible: Section 82 (formerly Section 54) is statutorily restricted to LTCG from the transfer of a residential house property");
    });

    it("Scenario C. Plot: 54 ineligible, 54EC eligible, 54F eligible (and tie_54ec_54f)", () => {
      // LTCG = ₹40L from plot sale.
      // 54: Ineligible.
      // 54EC: 40L in bonds in 3m -> tax = 0.
      // 54F: 40L in house, net sale 40L -> tax = 0.
      const res = calcSection54Exemption({
        sectionType: "compare_both",
        originalAssetType: "land_or_building_non_residential",
        capitalGainsAmount: 4000000,
        netSaleConsideration: 4000000,
        bondsInvestmentAmount: 4000000,
        bondsTimelineMonths: 3,
        section54fInvestmentAmount: 4000000,
        section54fPropertyMode: "purchase",
        section54fTimelineMonths: 6,
        existingResidentialHousesCount: 0,
      });

      expect(res.comparison).toBeDefined();
      expect(res.comparison?.section54.isStatutorilyEligible).toBe(false);
      expect(res.comparison?.section54ec.isStatutorilyEligible).toBe(true);
      expect(res.comparison?.section54f?.isStatutorilyEligible).toBe(true);
      expect(res.comparison?.bestStrategy).toBe("tie_54ec_54f");
      expect(res.comparison?.secondBestStrategy).toBe("none");
      expect(res.comparison?.recommendation).toContain("Section 85 (formerly Section 54EC Bonds (NHAI/REC/PFC/IRFC)) and Section 86 (formerly Section 54F (Reinvestment in House))");
      expect(res.comparison?.recommendation).toContain("provide equal tax savings");
      expect(res.comparison?.recommendation).toContain("Note (54 / Section 82): Ineligible");
    });

    it("Scenario D. Shares: 54 ineligible, 54EC ineligible, 54F eligible", () => {
      // LTCG = ₹30L from sale of equity shares.
      // 54: Ineligible (not residential house).
      // 54EC: Ineligible (shares are not land or building).
      // 54F: Eligible -> 30L reinvested in house with netSale 30L -> full exemption.
      const res = calcSection54Exemption({
        sectionType: "compare_both",
        originalAssetType: "other_long_term_asset",
        capitalGainsAmount: 3000000,
        netSaleConsideration: 3000000,
        propertyInvestmentAmount: 3000000,
        propertyMode: "purchase",
        propertyTimelineMonths: 6,
        bondsInvestmentAmount: 3000000,
        bondsTimelineMonths: 3,
        existingResidentialHousesCount: 0,
      });

      expect(res.comparison).toBeDefined();
      expect(res.comparison?.section54.isStatutorilyEligible).toBe(false);
      expect(res.comparison?.section54.exemptionAllowed).toBe(0);
      expect(res.comparison?.section54ec.isStatutorilyEligible).toBe(false);
      expect(res.comparison?.section54ec.exemptionAllowed).toBe(0);
      expect(res.comparison?.section54f?.isStatutorilyEligible).toBe(true);
      expect(res.comparison?.section54f?.exemptionAllowed).toBe(3000000);

      // 54F is the only eligible strategy
      expect(res.comparison?.bestStrategy).toBe("54F");
      expect(res.comparison?.secondBestStrategy).toBe("none");
      expect(res.comparison?.worstStrategy).toBe("54F");
      expect(res.comparison?.recommendation).toContain("Section 86 (formerly Section 54F (Reinvestment in House)) is the only eligible strategy");
      expect(res.comparison?.recommendation).toContain("Note (54 / Section 82): Ineligible");
      expect(res.comparison?.recommendation).toContain("Note (54EC / Section 85): Ineligible: Section 85 (formerly Section 54EC) is statutorily restricted to capital gains arising from the transfer of land or building");
    });

    it("Scenario E. Gold: 54 ineligible, 54EC ineligible, 54F eligible", () => {
      // LTCG = ₹20L from gold sale.
      const res = calcSection54Exemption({
        sectionType: "compare_both",
        originalAssetType: "other_long_term_asset",
        capitalGainsAmount: 2000000,
        netSaleConsideration: 2500000,
        propertyInvestmentAmount: 2500000,
        propertyMode: "construction",
        propertyTimelineMonths: 18,
        existingResidentialHousesCount: 1, // 1 house is eligible u/s 54F
      });

      expect(res.comparison?.section54.isStatutorilyEligible).toBe(false);
      expect(res.comparison?.section54ec.isStatutorilyEligible).toBe(false);
      expect(res.comparison?.section54f?.isStatutorilyEligible).toBe(true);
      expect(res.comparison?.section54f?.disqualified).toBe(false);
      expect(res.comparison?.bestStrategy).toBe("54F");
      expect(res.comparison?.secondBestStrategy).toBe("none");
    });

    it("Scenario F. Residential house + perfect 54F-looking inputs: 54F MUST remain ineligible", () => {
      // Transfer of residential house with zero other houses owned, perfect 54F inputs.
      // Section 54F MUST be statutorily ineligible by enacted law.
      const res = calcSection54Exemption({
        sectionType: "compare_both",
        originalAssetType: "residential_house",
        capitalGainsAmount: 10000000,
        netSaleConsideration: 10000000,
        section54InvestmentAmount: 10000000,
        section54PropertyMode: "purchase",
        section54TimelineMonths: 12,
        section54fInvestmentAmount: 10000000,
        section54fPropertyMode: "purchase",
        section54fTimelineMonths: 12,
        existingResidentialHousesCount: 0,
      });

      expect(res.comparison?.section54.isStatutorilyEligible).toBe(true);
      expect(res.comparison?.section54f?.isStatutorilyEligible).toBe(false);
      expect(res.comparison?.section54f?.exemptionAllowed).toBe(0);
      expect(res.comparison?.section54f?.ineligibilityReason).toContain("Section 86 (formerly Section 54F) is statutorily restricted to long-term capital assets other than a residential house");
      expect(res.comparison?.bestStrategy).toBe("54");
    });

    it("Scenario G. Shares + valid 54EC timeline/investment: 54EC MUST remain ineligible", () => {
      // Sale of shares with ₹50L bonds within 3 months.
      // 54EC MUST remain statutorily ineligible because shares are not land or building.
      const res = calcSection54Exemption({
        sectionType: "compare_both",
        originalAssetType: "other_long_term_asset",
        capitalGainsAmount: 5000000,
        bondsInvestmentAmount: 5000000,
        bondsTimelineMonths: 3, // Valid timeline
      });

      expect(res.comparison?.section54ec.isStatutorilyEligible).toBe(false);
      expect(res.comparison?.section54ec.isValidTimeline).toBe(true);
      expect(res.comparison?.section54ec.exemptionAllowed).toBe(0);
      expect(res.comparison?.section54ec.ineligibilityReason).toContain("Section 85 (formerly Section 54EC) is statutorily restricted to capital gains arising from the transfer of land or building");
      expect(res.comparison?.bestStrategy).toBe("none"); // 54F also not configured
    });

    it("Scenario H. Compare All never uses hidden/default 54F net consideration", () => {
      // In compare_both with other_long_term_asset, omit netSaleConsideration
      const res = calcSection54Exemption({
        sectionType: "compare_both",
        originalAssetType: "other_long_term_asset",
        capitalGainsAmount: 5000000,
        propertyInvestmentAmount: 5000000,
        propertyMode: "purchase",
        propertyTimelineMonths: 6,
        // netSaleConsideration omitted
      });

      expect(res.comparison?.section54f?.disqualified).toBe(true);
      expect(res.comparison?.section54f?.disqualificationReason).toContain("Net Sale Consideration is required for Section 86 (formerly Section 54F) proportionate exemption calculation in Compare mode");
      expect(res.comparison?.section54f?.exemptionAllowed).toBe(0);
      expect(res.comparison?.bestStrategy).toBe("none");
    });

    it("Scenario I. All applicable strategies invalid: bestStrategy === 'none'", () => {
      // Residential house transfer, but:
      // Section 54 has invalid purchase timeline (40 months > 24m)
      // Section 54EC has invalid bond timeline (12 months > 6m)
      // Section 54F is ineligible
      const res = calcSection54Exemption({
        sectionType: "compare_both",
        originalAssetType: "residential_house",
        capitalGainsAmount: 5000000,
        propertyInvestmentAmount: 5000000,
        propertyMode: "purchase",
        propertyTimelineMonths: 40, // Invalid for 54
        bondsInvestmentAmount: 5000000,
        bondsTimelineMonths: 12, // Invalid for 54EC
      });

      expect(res.comparison).toBeDefined();
      expect(res.comparison?.bestStrategy).toBe("none");
      expect(res.comparison?.secondBestStrategy).toBe("none");
      expect(res.comparison?.worstStrategy).toBe("none");
      expect(res.comparison?.taxDifference).toBe(0);
      expect(res.comparison?.recommendation).toContain("No eligible statutory exemption strategy available for residential house property");
      expect(res.comparison?.recommendation).toContain("Note (54 / Section 82): Invalid purchase timeline");
      expect(res.comparison?.recommendation).toContain("Note (54EC / Section 85): Invalid timeline");
      expect(res.comparison?.recommendation).toContain("Note (54F / Section 86): Ineligible");
    });
  });

  describe("Section 82 Once-in-a-Lifetime Two-Residential-House Option Tests", () => {
    it("permits combined investment in two residential houses when LTCG <= ₹2 Crore and option never previously exercised", () => {
      // Capital gain = ₹1.8 Crore (<= ₹2 Cr)
      // House 1: ₹1.2 Crore, House 2: ₹60 Lakh -> Total ₹1.8 Crore
      const res = calcSection54Exemption({
        sectionType: "section_54_property",
        capitalGainsAmount: 18000000,
        section54InvestmentAmount: 12000000, // House 1
        secondPropertyInvestmentAmount: 6000000, // House 2
        useTwoResidentialHousesOption: true,
        twoHousesOptionExercisedPreviously: false,
        propertyMode: "purchase",
        propertyTimelineMonths: 12,
      });

      expect(res.activeResult.isStatutorilyEligible).toBe(true);
      expect(res.activeResult.twoHousesOptionApplied).toBe(true);
      expect(res.activeResult.investmentAmount).toBe(18000000);
      expect(res.activeResult.exemptionAllowed).toBe(18000000);
      expect(res.activeResult.taxAfterExemption).toBe(0);
      expect(res.activeResult.twoHousesOptionMessage).toContain("Once-in-a-lifetime Section 82 option applied");
    });

    it("rejects two-house option when capital gain exceeds ₹2 Crore, restricting exemption to single house", () => {
      // Capital gain = ₹2.5 Crore (> ₹2 Cr statutory ceiling)
      // House 1: ₹1.5 Crore, House 2: ₹1.0 Crore
      const res = calcSection54Exemption({
        sectionType: "section_54_property",
        capitalGainsAmount: 25000000,
        section54InvestmentAmount: 15000000,
        secondPropertyInvestmentAmount: 10000000,
        useTwoResidentialHousesOption: true,
        twoHousesOptionExercisedPreviously: false,
        propertyMode: "purchase",
        propertyTimelineMonths: 12,
      });

      expect(res.activeResult.isStatutorilyEligible).toBe(true);
      expect(res.activeResult.twoHousesOptionApplied).toBe(false);
      // Only House 1 is eligible: ₹1.5 Crore
      expect(res.activeResult.investmentAmount).toBe(15000000);
      expect(res.activeResult.exemptionAllowed).toBe(15000000);
      expect(res.activeResult.taxableGainsRemaining).toBe(10000000);
      expect(res.activeResult.twoHousesOptionMessage).toContain("statutorily restricted to cases where Long-Term Capital Gains do not exceed ₹2 Crore");
    });

    it("rejects two-house option when taxpayer previously exercised it in any prior tax year", () => {
      // Capital gain = ₹1.5 Crore (<= ₹2 Cr), but already exercised once
      const res = calcSection54Exemption({
        sectionType: "section_54_property",
        capitalGainsAmount: 15000000,
        section54InvestmentAmount: 10000000,
        secondPropertyInvestmentAmount: 5000000,
        useTwoResidentialHousesOption: true,
        twoHousesOptionExercisedPreviously: true, // Previously exercised
        propertyMode: "purchase",
        propertyTimelineMonths: 12,
      });

      expect(res.activeResult.isStatutorilyEligible).toBe(true);
      expect(res.activeResult.twoHousesOptionApplied).toBe(false);
      // Only single house permitted
      expect(res.activeResult.investmentAmount).toBe(10000000);
      expect(res.activeResult.exemptionAllowed).toBe(10000000);
      expect(res.activeResult.twoHousesOptionMessage).toContain("strictly once-in-a-lifetime");
    });
  });
});
