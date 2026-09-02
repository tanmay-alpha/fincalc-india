import { describe, expect, it } from "vitest";
import { calcCapitalGains } from "@/lib/math";

describe("capital-gains output semantics", () => {
  it("reports the Section 112A threshold separately from the chargeable equity LTCG", () => {
    const result = calcCapitalGains({
      assetClass: "equity",
      purchasePrice: 500_000,
      salePrice: 1_000_000,
      holdingMonths: 24,
      priorExemptionUsed: 0,
    });

    expect(result.grossCapitalGain).toBe(500_000);
    expect(result.capitalGainIncludedInTotalIncome).toBe(500_000);
    expect(result.annualThresholdOrExemptionUsed).toBe(125_000);
    expect(result.specialRateChargeableGain).toBe(375_000);
    expect(result.taxableGain).toBe(375_000);
    expect(result.totalTaxPayable).toBe(46_875);
  });
});
